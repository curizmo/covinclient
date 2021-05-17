import React, { useCallback, useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { ImLab } from 'react-icons/im';

import HeadersComponent from '../common/HeadersComponent/HeadersComponent';

import med from '../../assets/images/grey-med.svg';
import closeIcon from '../../assets/images/blue-close.svg';
import minusIcon from '../../assets/images/minus.svg';
import calenderIcon from '../../assets/images/calenderIcon.svg';
import plusIcon from '../../assets/images/plus-icon.png';
import prescriptionIcon from '../../assets/images/prescriptionIcon.svg';
import showMoreIcon from 'assets/images/svg-icons/showMore.svg';
import showLessIcon from 'assets/images/svg-icons/showLess.svg';

import {
  ContentWrap,
  TopContainer,
  SearchDrpWrap,
  SearchBox,
  DropDownWrap,
  EachItem,
  Name,
  PrescriptionWrap,
  MedName,
  MedDose,
  MedIcon,
  DesktopViewPastPrescription,
  PastOrderText,
  PastPrescriptionConsultant,
  PastPrescriptionDate,
  LastRow,
  PastPrescriptionImageIcon,
  PastPrescriptionText,
  Icon,
  ActionIcon,
  CloseIcon,
  IconSmall,
  ImgButton,
  HeaderReaderWrap,
  ReadingFontStyle,
  ReadingIconStyleRepresentation,
  IconRepresentation,
} from './styles';

import { getMedications } from 'services/medication';
import { getLabs } from 'services/labs';

export const PatientPrescription = ({
  prescriptionList,
  setPrescriptionList,
  pastPrescriptions,
  labsList,
  setLabsList,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [labsSearchValue, setLabsSearchValue] = useState('');
  const [dropdownList, setDropdownList] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [labsOptions, setLabsOptions] = useState([]);
  const [labsDropdownList, setLabsDropdownList] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchMedicines();
    fetchLabs();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await getMedications();

      let medications = response.data.medications.map((medication) => {
        return {
          name: medication.medicationDesc,
          frequency: '',
        };
      });

      setMedicineList(medications);
    } catch {
      // TODO: Handle error
    }
  };

  const fetchLabs = async () => {
    try {
      const response = await getLabs();

      const { labs } = response.data;

      setLabsOptions(labs);
    } catch {
      // TODO: Handle error
    }
  };

  const handleMedicationSearch = (text) => {
    if (text) {
      let value = medicineList?.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );

      setDropdownList(value);
    } else {
      setDropdownList([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e?.target?.value);
    delayedHandleSearchChange(e?.target?.value);
  };

  const delayedHandleSearchChange = useCallback(
    debounce(handleMedicationSearch, 1000),
    [medicineList],
  );

  const checkAvailability = (name) => {
    if (prescriptionList.length > 0) {
      let obj = prescriptionList.find(
        (item) => item?.name?.toLowerCase() === name?.toLowerCase(),
      );
      if (obj) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const checkLabsAvailability = (name) => {
    if (labsList.length > 0) {
      let obj = labsList.find(
        (item) => item?.name?.toLowerCase() === name?.toLowerCase(),
      );
      if (obj) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const onAddClick = (name) => {
    setPrescriptionList((prev) => [...prev, { name, frequency: '' }]);
    setDropdownList([]);
    setSearchValue('');
  };

  const onRemoveClick = (name) => {
    prescriptionList.splice(
      prescriptionList.findIndex(
        (el) => el?.name?.toLowerCase() === name?.toLowerCase(),
      ),
      1,
    );
    setPrescriptionList([...prescriptionList]);
  };

  const onLabsAddClick = (name) => {
    setLabsList((prev) => [...prev, { name }]);
    setLabsDropdownList([]);
    setLabsSearchValue('');
  };

  const onLabsRemoveClick = (name) => {
    labsList.splice(
      labsList.findIndex(
        (el) => el?.name?.toLowerCase() === name?.toLowerCase(),
      ),
      1,
    );
    setLabsList([...labsList]);
  };

  const onIconClick = (name) => {
    if (!checkAvailability(name)) {
      onAddClick(name);
    } else {
      onRemoveClick(name);
    }
  };

  const onLabsIconClick = (name) => {
    if (!checkLabsAvailability(name)) {
      onLabsAddClick(name);
    } else {
      onLabsRemoveClick(name);
    }
  };

  const removeMed = (i) => {
    prescriptionList.splice(i, 1);
    setPrescriptionList([...prescriptionList]);
  };

  const removeLab = (i) => {
    labsList.splice(i, 1);
    setLabsList([...labsList]);
  };

  const handleFrequencyChange = (e, index) => {
    const value = e.target.value;

    const newPrescriptionList = prescriptionList.map((prescription, i) => {
      if (i === index) {
        return {
          ...prescription,
          frequency: value,
        };
      }

      return prescription;
    });

    setPrescriptionList(newPrescriptionList);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleLabsSearch = (text) => {
    if (text) {
      let value = labsOptions?.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );

      setLabsDropdownList(value);
    } else {
      setLabsDropdownList([]);
    }
  };

  const handleLabsSearchChange = (e) => {
    setLabsSearchValue(e?.target?.value);
    delayedHandleLabsSearchChange(e?.target?.value);
  };

  const delayedHandleLabsSearchChange = useCallback(
    debounce(handleLabsSearch, 1000),
    [labsOptions],
  );

  return (
    <>
      <HeadersComponent
        image={prescriptionIcon}
        alt={'prescription-icon'}
        text={'Prescription'}
      />
      <ContentWrap>
        <TopContainer>
          <div>
            <SearchDrpWrap>
              <SearchBox
                type="text"
                name="search"
                value={searchValue}
                autoComplete="off"
                placeholder="Type Prescription/lab"
                onChange={handleSearchChange}
              />
              {dropdownList?.length > 0 && (
                <DropDownWrap>
                  {dropdownList.map((item) => {
                    return (
                      <EachItem key={item.name}>
                        <Name>{item.name}</Name>
                        <Icon onClick={() => onIconClick(item.name)}>
                          {checkAvailability(item.name) ? (
                            <ActionIcon src={minusIcon} alt="minus" />
                          ) : (
                            <ActionIcon src={plusIcon} alt="plus" />
                          )}
                        </Icon>
                      </EachItem>
                    );
                  })}
                </DropDownWrap>
              )}
            </SearchDrpWrap>
            {prescriptionList?.length > 0 && (
              <>
                {prescriptionList?.map((item, index) => {
                  return (
                    <PrescriptionWrap key={item.name}>
                      <MedName>
                        <MedIcon src={med} alt="med" />
                        {item.name}
                      </MedName>
                      <MedDose
                        placeholder="Add dosage"
                        onChange={(e) => handleFrequencyChange(e, index)}
                      />
                      <CloseIcon
                        src={closeIcon}
                        alt="close"
                        onClick={() => removeMed(index)}
                      />
                    </PrescriptionWrap>
                  );
                })}
              </>
            )}
          </div>
        </TopContainer>
      </ContentWrap>
      <ContentWrap>
        <HeaderReaderWrap>
          <ReadingIconStyleRepresentation>
            <IconRepresentation>
              <ImLab />
            </IconRepresentation>
            <ReadingFontStyle>Labs</ReadingFontStyle>
          </ReadingIconStyleRepresentation>
        </HeaderReaderWrap>
        <TopContainer>
          <SearchDrpWrap>
            <SearchBox
              type="text"
              name="search"
              value={labsSearchValue}
              autoComplete="off"
              placeholder="Type lab"
              onChange={handleLabsSearchChange}
            />
            {labsDropdownList?.length > 0 && (
              <DropDownWrap>
                {labsDropdownList.map((item) => {
                  return (
                    <EachItem key={item.name}>
                      <Name>{item.name}</Name>
                      <Icon onClick={() => onLabsIconClick(item.name)}>
                        {checkLabsAvailability(item.name) ? (
                          <ActionIcon src={minusIcon} alt="minus" />
                        ) : (
                          <ActionIcon src={plusIcon} alt="plus" />
                        )}
                      </Icon>
                    </EachItem>
                  );
                })}
              </DropDownWrap>
            )}
          </SearchDrpWrap>
          {labsList?.length > 0 && (
            <>
              {labsList?.map((item, index) => {
                return (
                  <PrescriptionWrap key={item.name}>
                    <MedName>
                      <MedIcon src={med} alt="med" />
                      {item.name}
                    </MedName>
                    <CloseIcon
                      src={closeIcon}
                      alt="close"
                      onClick={() => removeLab(index)}
                    />
                  </PrescriptionWrap>
                );
              })}
            </>
          )}
        </TopContainer>
      </ContentWrap>

      <ContentWrap>
        <DesktopViewPastPrescription>
          <PastOrderText>
            <div>
              <IconSmall>
                <img src={prescriptionIcon} alt="pill" />
              </IconSmall>
              Past Orders
            </div>
            <div>
              {showMore ? (
                <ImgButton type="button" onClick={toggleShowMore}>
                  <img src={showLessIcon} alt="show less" />
                </ImgButton>
              ) : (
                <ImgButton type="button" onClick={toggleShowMore}>
                  <img src={showMoreIcon} alt="show more" />
                </ImgButton>
              )}
            </div>
          </PastOrderText>
          {showMore && pastPrescriptions?.length
            ? pastPrescriptions.map((prescription) => {
                if (
                  !(
                    prescription?.prescriptions?.length ||
                    prescription?.labs?.length
                  )
                ) {
                  return null;
                }

                return (
                  <>
                    {prescription?.prescriptions?.length ? (
                      <LastRow
                        key={`${prescription.organizationEventBookingId}-prescription`}>
                        <PastPrescriptionImageIcon
                          src={calenderIcon}
                          alt="cal"
                        />
                        <PastPrescriptionText>
                          <PastPrescriptionDate>
                            {prescription.eventStartTime}
                          </PastPrescriptionDate>
                          <PastPrescriptionConsultant>
                            {prescription.prescriptions.length} Prescription
                          </PastPrescriptionConsultant>
                        </PastPrescriptionText>
                      </LastRow>
                    ) : null}
                    {prescription?.labs?.length ? (
                      <LastRow
                        key={`${prescription.organizationEventBookingId}-lab`}>
                        <PastPrescriptionImageIcon
                          src={calenderIcon}
                          alt="cal"
                        />
                        <PastPrescriptionText>
                          <PastPrescriptionDate>
                            {prescription.eventStartTime}
                          </PastPrescriptionDate>
                          <PastPrescriptionConsultant>
                            {prescription.labs.length} Lab
                          </PastPrescriptionConsultant>
                        </PastPrescriptionText>
                      </LastRow>
                    ) : null}
                  </>
                );
              })
            : null}
        </DesktopViewPastPrescription>
      </ContentWrap>
    </>
  );
};

PatientPrescription.propTypes = {
  data: PropTypes.object,
};
