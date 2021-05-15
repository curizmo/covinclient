import React, { useCallback, useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { debounce } from 'lodash';

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
  TopRow,
  SearchDrpWrap,
  SearchBox,
  DropDownWrap,
  EachItem,
  Name,
  PrescriptionWrap,
  MedName,
  MedDose,
  MedIcon,
  BottomRow,
  SendToPatientBtn,
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
} from './styles';

import { getMedications } from 'services/medication';

export const PatientPrescription = ({
  prescriptionList,
  setPrescriptionList,
  handleSendToPatient,
  pastPrescriptions,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownList, setDropdownList] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchMedicines();
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

  const onIconClick = (name) => {
    if (!checkAvailability(name)) {
      onAddClick(name);
    } else {
      onRemoveClick(name);
    }
  };

  const removeMed = (i) => {
    prescriptionList.splice(i, 1);
    setPrescriptionList([...prescriptionList]);
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

  return (
    <>
      <HeadersComponent
        image={prescriptionIcon}
        alt={'prescription-icon'}
        text={'Prescription'}
      />
      <ContentWrap>
        <TopContainer>
          <TopRow>
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
          </TopRow>
          <BottomRow>
            <SendToPatientBtn type="button" onClick={handleSendToPatient}>
              SEND TO PATIENT
            </SendToPatientBtn>
          </BottomRow>
        </TopContainer>

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
                if (!prescription?.prescriptions?.length) {
                  return null;
                }

                return (
                  <LastRow key={prescription.organizationEventBookingId}>
                    <PastPrescriptionImageIcon src={calenderIcon} alt="cal" />
                    <PastPrescriptionText>
                      <PastPrescriptionDate>
                        {prescription.eventStartTime}
                      </PastPrescriptionDate>
                      <PastPrescriptionConsultant>
                        {prescription?.prescriptions?.length} Prescriptions
                      </PastPrescriptionConsultant>
                    </PastPrescriptionText>
                  </LastRow>
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
