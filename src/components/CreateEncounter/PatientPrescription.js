import React, { Fragment, useCallback, useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { debounce } from 'lodash';

import HeadersComponent from '../common/HeadersComponent/HeadersComponent';

import { Button } from 'reactstrap';

import med from '../../assets/images/grey-med.svg';
import closeIcon from '../../assets/images/blue-close.svg';
import minusIcon from '../../assets/images/minus.svg';
import calenderIcon from '../../assets/images/calenderIcon.svg';
import plusIcon from '../../assets/images/plus-icon.png';
import prescriptionIcon from '../../assets/images/svg-icons/prescriptionIcon.svg';
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
import SendToPatientPreviewModal from './SendToPatientPreviewModal';
import { createEncounter } from 'services/patient';
import {
  createPatientMedication,
  deletePatientMedication,
  updatePatientMedication,
} from 'services/patientMedication';
import { createPatientLab, deletePatientLab } from 'services/patientLabs';
import { getRandomKey } from 'utils';

export const PatientPrescription = ({
  patientData,
  prescriptionList,
  setPrescriptionList,
  pastPrescriptions,
  appointmentId,
  setAppointmentId,
  patientId,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownList, setDropdownList] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showPreviewWindow, setShowPreviewWindow] = useState(false);

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

  const onAddClick = async (item) => {
    let appointmentIdValue = appointmentId;
    if (!appointmentId) {
      appointmentIdValue = await createNewEncounter();
    }

    let response = {};

    if (item.label === 'prescription') {
      response = await createPatientMedication(item, appointmentIdValue);
    } else {
      response = await createPatientLab(item, appointmentIdValue);
    }

    setPrescriptionList((prev) => [
      ...prev,
      {
        name: item.name,
        frequency: '',
        label: item.label,
        id: response.data.id,
      },
    ]);
    setDropdownList([]);
    setSearchValue('');
  };

  const onRemoveClick = async (item) => {
    let selectedItem = { ...item };
    if (!selectedItem.id) {
      selectedItem = prescriptionList.find(
        (prescription) =>
          prescription?.name?.toLowerCase() === item?.name?.toLowerCase(),
      );
    }

    if (item.label === 'prescription') {
      await deletePatientMedication(selectedItem.id, appointmentId);
    } else {
      await deletePatientLab(selectedItem.id, appointmentId);
    }

    const newPrescriptionList = prescriptionList.filter(
      (prescription) =>
        prescription?.name?.toLowerCase() !== item?.name?.toLowerCase(),
    );

    setPrescriptionList(newPrescriptionList);
    setDropdownList([]);
    setSearchValue('');
  };

  const onIconClick = (item) => {
    if (!checkAvailability(item.name)) {
      onAddClick(item);
    } else {
      onRemoveClick(item);
    }
  };

  const handleFrequencyChange = async (value, index, item) => {
    await updatePatientMedication(
      {
        ...item,
        frequency: value,
      },
      item.id,
      appointmentId,
    );

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

  const delayedHandleFrequencyChange = useCallback(
    debounce((value, index, item) => {
      handleFrequencyChange(value, index, item);
    }, 1000),
    [appointmentId, prescriptionList],
  );

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const createNewEncounter = async () => {
    try {
      const response = await createEncounter(
        {
          patientId,
          labs: JSON.stringify(
            prescriptionList.filter(
              (prescription) => prescription.label === 'lab',
            ),
          ),
          prescriptionList: JSON.stringify(
            prescriptionList.filter(
              (prescription) => prescription.label === 'prescription',
            ),
          ),
          note: '',
        },
        patientId,
      );

      const { organizationEventBookingId } = response.data;
      setAppointmentId(organizationEventBookingId);

      return organizationEventBookingId;
    } catch (err) {
      // TODO: Handle error
    }
  };

  const handlePreview = useCallback(() => {
    setShowPreviewWindow(true);
  });

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
                          onChange={(e) => {
                            delayedHandleFrequencyChange(
                              e.target.value,
                              index,
                              item,
                            );
                          }}
                        />
                      ) : null}
                      <CloseIcon
                        src={closeIcon}
                        alt="close"
                        onClick={() => onRemoveClick(item)}
                      />
                    </PrescriptionWrap>
                  );
                })}
              </>
            )}
          </div>
          <Button className="mt-3" onClick={handlePreview}>
            Preview And Send To Patient
          </Button>
          <SendToPatientPreviewModal
            patientData={patientData}
            prescriptionList={prescriptionList}
            show={showPreviewWindow}
            setShowPreviewWindow={setShowPreviewWindow}
          />
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
                  <Fragment key={getRandomKey()}>
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
                  </Fragment>
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
