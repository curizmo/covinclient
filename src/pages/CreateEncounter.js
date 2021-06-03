import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { debounce } from 'lodash';

import {
  PatientNotes,
  PersonalInformation,
  PatientPrescription,
  GraphicalReadings,
} from 'components/CreateEncounter';
import { GraphicalRepresentation } from 'components/GraphicalRepresentation';
import { DashboardLayout } from 'components/common/Layout';

import { fetchPatient } from 'actions';

import { getPatient, getIsEncounterUpdated, getUser } from 'selectors';

import { createEncounter, updatePatientRiskStatus } from 'services/patient';
import { createOrUpdateEncounter } from 'services/appointment';
import { fetchPatientSymptoms } from 'services/symptoms';

import { getRandomKey, getTabIndex } from 'utils';

import { routes } from 'routers';

import notesIcon from 'assets/images/svg-icons/notesIcon.svg';
import lineGraphIcon from 'assets/images/svg-icons/lineGraphIcon.svg';
import prescriptionIcon from 'assets/images/svg-icons/prescriptionIcon.svg';
import notesSelectedIcon from 'assets/images/svg-icons/notes-selected.svg';
import lineGraphSelectedIcon from 'assets/images/svg-icons/reading-selected.svg';
import prescriptionSelectedIcon from 'assets/images/svg-icons/orders-selected.svg';
import time from 'assets/images/svg-icons/clock.svg';
import {
  DateAndTime,
  DateAndTimeWrap,
  InfoWrapper,
  TimeImage,
  ViewName,
  Wrapper,
  InitiateCovidScreenWrap,
  NoRecordStyling,
  PendingMsg,
  InitiateCovidScreening,
  ResendWrap,
} from 'global/styles';
import { getDate } from 'global';
import { isLightVersion } from 'config';
import { Symptoms } from 'components/CreateEncounter/Symptoms';

const PATIENT_DETAILS_TABS = {
  READINGS: 'Readings',
  NOTES: 'Notes',
  PRESCRIPTION: 'Prescription',
};

const tabMenu = [
  {
    name: PATIENT_DETAILS_TABS.NOTES,
    icon: notesIcon,
    selectedIcon: notesSelectedIcon,
  },
  {
    name: PATIENT_DETAILS_TABS.PRESCRIPTION,
    icon: prescriptionIcon,
    selectedIcon: prescriptionSelectedIcon,
  },
  {
    name: PATIENT_DETAILS_TABS.READINGS,
    icon: lineGraphIcon,
    selectedIcon: lineGraphSelectedIcon,
  },
];

const PatientDetailsWrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(101, 115, 150, 0.1);
  border-radius: 5px;
  @media (max-width: 768px) {
    box-shadow: none;
  }
`;

const MedInfoWrap = styled.div`
  display: flex;
  border-top: 1px solid rgba(101, 115, 150, 0.2);
  @media (max-width: 768px) {
    display: none;
  }
`;
const Column = styled.div`
  width: ${(props) => (props.isLightVersion ? '50%' : '33.33%')};
  border-right: 1px solid rgba(101, 115, 150, 0.2);
  &:last-child {
    border-right: none;
    flex-direction: column;
    display: flex;
}
  }
`;

const MobileViewMedInfoWrap = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const TabWrap = styled.div`
  display: flex;
  height: 3.125rem;
  width: 100%;
  @media (max-width: 768px) {
    margin-top: 1.25rem;
  }
`;

const EachTab = styled.div`
  width: 33.33%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.selected ? '#22335E' : '#F2F5F8')};
  color: ${(props) => (props.selected ? '#fff' : '#22335E')};
  cursor: pointer;
`;

const TabName = styled.span`
  font-weight: bold;
  font-size: 0.9375rem;
  line-height: 1.25rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
`;

const spacingAroundComponent = css`
  height: 12rem;
  background: #f2f7fd;
  padding: 0.5rem;
  margin: 1rem 0rem 0.3125rem;
`;

const desktopViewLabelsForPatientsWithCurrentStats = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const ContentWrap = styled.div`
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1.25rem;
  }
`;

const infoExtraCss = css`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Icon = styled.img`
  height: 16px;
  margin-right: 0.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f2f7fd;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Tab = styled.div`
  font-weight: bold;
  font-size: 0.9375rem;
  line-height: 1.25rem;
  color: #22335e;
  padding: 1rem;
  width: 50%;
  text-align: center;
  border-bottom: ${(props) => (props.active ? '3px solid #22335E' : '')};
`;

const VITALS_TABS = {
  vitals: 'vitals',
  symptoms: 'symptoms',
};

function CreateEncounter() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { patientId } = useParams();
  const patientData = useSelector(getPatient);
  const user = useSelector(getUser);

  const isEncounterUpdated = useSelector(getIsEncounterUpdated);

  const [selectedTab, setSelectedTab] = useState(PATIENT_DETAILS_TABS.READINGS);
  const [riskLevel, setRiskLevel] = useState('');
  const [note, setNote] = useState('');
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [labsList, setLabsList] = useState([]);
  const [vitalsCompletionStatus, setVitalsCompletionStatus] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [vitalsActiveTab, setVitalsActiveTab] = useState(VITALS_TABS.vitals);
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    setRiskLevel(patientData?.status);
    // @toDo receive patientParameterStatus
    setVitalsCompletionStatus(
      patientData?.patientParameterStatus ?? 'Completed',
    );
  }, [patientData]);

  useEffect(() => {
    dispatch(fetchPatient({ patientId, ntoUserId: user.NTOUserID }));
  }, [dispatch, patientId, user.NTOUserID]);

  useEffect(() => {
    const fetchSymptoms = async (patientId) => {
      try {
        const response = await fetchPatientSymptoms(patientId);

        setSymptoms(response.data.symptoms);
      } catch (err) {
        // TODO: Handle err.
      }
    };

    fetchSymptoms(patientId);
  }, [patientId]);

  useEffect(() => {
    if (isEncounterUpdated) {
      history.push(routes.patients.path);
    }
  }, [isEncounterUpdated]);

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setNote(value);
    setIsNoteLoading(true);
    setIsNoteSaved(false);
    delayedHandleNoteChange(value);
  };

  const createNewEncounter = async (note) => {
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
          note,
        },
        patientId,
      );

      const { organizationEventBookingId } = response.data;
      setAppointmentId(organizationEventBookingId);
      setIsNoteSaved(true);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const updateEncounter = async (note) => {
    try {
      const encounter = {
        note,
      };

      await createOrUpdateEncounter(appointmentId, {
        data: { ...encounter },
      });
      setIsNoteSaved(true);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const delayedHandleNoteChange = useCallback(
    debounce((note) => {
      if (!appointmentId) {
        createNewEncounter(note);
      } else {
        updateEncounter(note);
      }
    }, 1000),
    [appointmentId, prescriptionList, patientId],
  );

  const handleSaveAndClose = () => {
    history.push(routes.patients.path);
  };

  const handleRiskLevelChange = async (value) => {
    await updatePatientRiskStatus(patientId, { status: value });

    setRiskLevel(value);
  };

  return (
    <DashboardLayout>
      <Wrapper>
        <InfoWrapper extraCss={infoExtraCss}>
          <ViewName>Patient</ViewName>
          <DateAndTimeWrap>
            <TimeImage src={time} />
            <DateAndTime>{getDate()}</DateAndTime>
          </DateAndTimeWrap>
        </InfoWrapper>
        <PatientDetailsWrapper>
          <PersonalInformation
            dispatch={dispatch}
            data={patientData}
            onSave={handleSaveAndClose}
            riskLevel={riskLevel}
            setRiskLevel={setRiskLevel}
            handleRiskLevelChange={handleRiskLevelChange}
          />
          <MedInfoWrap>
            <Column isLightVersion>
              <TabContainer>
                <Tab
                  role="button"
                  tabIndex={getTabIndex()}
                  onClick={() => setVitalsActiveTab(VITALS_TABS.vitals)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setVitalsActiveTab(VITALS_TABS.vitals);
                    }
                  }}
                  active={vitalsActiveTab === VITALS_TABS.vitals}>
                  Vitals
                </Tab>
                <Tab
                  role="button"
                  tabIndex={getTabIndex()}
                  onClick={() => setVitalsActiveTab(VITALS_TABS.symptoms)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setVitalsActiveTab(VITALS_TABS.symptoms);
                    }
                  }}
                  active={vitalsActiveTab === VITALS_TABS.symptoms}>
                  Symptoms
                </Tab>
              </TabContainer>
              {vitalsActiveTab === VITALS_TABS.vitals && (
                <GraphicalReadings data={patientData} />
              )}
              {vitalsActiveTab === VITALS_TABS.symptoms && (
                <Symptoms symptoms={symptoms} />
              )}
            </Column>
            <Column isLightVersion>
              <PatientNotes
                note={note}
                handleNoteChange={handleNoteChange}
                pastNotes={patientData.pastNotes}
                isNoteLoading={isNoteLoading}
                isNoteSaved={isNoteSaved}
              />
            </Column>
            {!isLightVersion && (
              <Column>
                <PatientPrescription
                  patientData={patientData}
                  prescriptionList={prescriptionList}
                  setPrescriptionList={setPrescriptionList}
                  pastPrescriptions={patientData.pastPrescriptions}
                  labsList={labsList}
                  setLabsList={setLabsList}
                  appointmentId={appointmentId}
                  setAppointmentId={setAppointmentId}
                  patientId={patientId}
                />
              </Column>
            )}
          </MedInfoWrap>
          <MobileViewMedInfoWrap>
            <TabWrap>
              {tabMenu.map((tab) => {
                const isSelected = selectedTab === tab?.name;
                return (
                  <EachTab
                    key={getRandomKey()}
                    onClick={() => setSelectedTab(tab?.name)}
                    selected={isSelected}>
                    <TabName>
                      <Icon
                        src={isSelected ? tab.selectedIcon : tab.icon}
                        alt="icon"
                      />
                      {tab?.name}
                    </TabName>
                  </EachTab>
                );
              })}
            </TabWrap>
            <ContentWrap>
              {selectedTab === PATIENT_DETAILS_TABS.READINGS && (
                <>
                  {/* Initiated-when user initiates covid screening,
                    Pending-when patient hasnt completed his vitals fill up,
                    Completed- All the information is availaible} */}
                  {vitalsCompletionStatus === 'Initiated' && (
                    <InitiateCovidScreenWrap>
                      <NoRecordStyling>No Record Availaible</NoRecordStyling>
                      <InitiateCovidScreening>
                        INITIATE COVID SCREENING
                      </InitiateCovidScreening>
                    </InitiateCovidScreenWrap>
                  )}
                  {vitalsCompletionStatus === 'Pending' && (
                    <InitiateCovidScreenWrap>
                      <NoRecordStyling>No Record Availaible</NoRecordStyling>
                      <PendingMsg>
                        <span>
                          Invite has been sent to patient, Awaiting Covid
                          details...
                        </span>
                      </PendingMsg>
                      <ResendWrap>Resend</ResendWrap>
                    </InitiateCovidScreenWrap>
                  )}
                  {vitalsCompletionStatus === 'Completed' && (
                    <GraphicalRepresentation
                      data={patientData}
                      spacingAroundComponent={spacingAroundComponent}
                      desktopViewLabelsForPatientsWithCurrentStats={
                        desktopViewLabelsForPatientsWithCurrentStats
                      }
                      preferenceList={{
                        axisXLines: true,
                        showXAxisFonts: false,
                        showTooltip: true,
                        xScalePaddingOuter: 5,
                        yAxisFontSize: 12,
                      }}
                    />
                  )}
                </>
              )}
              {selectedTab === PATIENT_DETAILS_TABS.NOTES && (
                <PatientNotes
                  note={note}
                  handleNoteChange={handleNoteChange}
                  pastNotes={patientData.pastNotes}
                  isNoteLoading={isNoteLoading}
                  isNoteSaved={isNoteSaved}
                />
              )}
              {selectedTab === PATIENT_DETAILS_TABS.PRESCRIPTION && (
                <PatientPrescription
                  patientData={patientData}
                  prescriptionList={prescriptionList}
                  setPrescriptionList={setPrescriptionList}
                  pastPrescriptions={patientData.pastPrescriptions}
                  labsList={labsList}
                  setLabsList={setLabsList}
                  appointmentId={appointmentId}
                  setAppointmentId={setAppointmentId}
                  patientId={patientId}
                />
              )}
            </ContentWrap>
          </MobileViewMedInfoWrap>
        </PatientDetailsWrapper>
      </Wrapper>
    </DashboardLayout>
  );
}

export default CreateEncounter;
