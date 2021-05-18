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
} from './styles';

import { getMedications } from 'services/medication';
import { getLabs } from 'services/labs';

export const PatientPrescription = ({
  prescriptionList,
  setPrescriptionList,
  pastPrescriptions,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownList, setDropdownList] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchMedicinesAndLabs();
  }, []);

  const fetchMedicinesAndLabs = async () => {
    try {
      const [medicationResponse, labResponse] = await Promise.all([
        getMedications(),
        getLabs(),
      ]);

      let medications = medicationResponse.data.medications.map(
        (medication) => {
          return {
            name: medication.medicationDesc,
            frequency: '',
            label: 'prescription',
          };
        },
      );

      let labs = labResponse.data.labs.map((lab) => {
        return {
          ...lab,
          label: 'lab',
        };
      });

      setMedicineList([...medications, ...labs]);
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
    return prescriptionList?.some(
      (item) => item?.name?.toLowerCase() === name?.toLowerCase(),
    );
  };

  const onAddClick = (item) => {
    setPrescriptionList((prev) => [
      ...prev,
      { name: item.name, frequency: '', label: item.label },
    ]);
    setDropdownList([]);
    setSearchValue('');
  };

  const onRemoveClick = (name) => {
    const newPrescriptionList = prescriptionList.filter(
      (prescription) => prescription?.name?.toLowerCase !== name?.toLowerCase,
    );

    setPrescriptionList(newPrescriptionList);
  };

  const onIconClick = (item) => {
    if (!checkAvailability(item.name)) {
      onAddClick(item);
    } else {
      onRemoveClick(item.name);
    }
  };

  const removeMed = (i) => {
    const newPrescriptionList = prescriptionList.filter(
      (prescription, index) => i !== index,
    );

    setPrescriptionList(newPrescriptionList);
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
        text={'Prescription & Labs'}
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
                        <Icon onClick={() => onIconClick(item)}>
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
                      {item.label === 'prescription' ? (
                        <MedDose
                          placeholder="Add dosage"
                          onChange={(e) => handleFrequencyChange(e, index)}
                        />
                      ) : null}
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
