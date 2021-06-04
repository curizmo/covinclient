import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { css } from 'styled-components';
import { debounce } from 'lodash';

import {
  PatientNotes,
  PersonalInformation,
  PatientPrescription,
  GraphicalReadings,
} from 'components/CreateEncounter';
import { GraphicalRepresentation } from 'components/GraphicalRepresentation';
import { DashboardLayout } from 'components/common/Layout';
import { Symptoms } from 'components/CreateEncounter/Symptoms';
import { LabResults } from 'components/CreateEncounter/LabResults';

import { fetchPatient } from 'actions';

import { getPatient, getIsEncounterUpdated, getUser } from 'selectors';

import { createEncounter, updatePatientRiskStatus } from 'services/patient';
import { createOrUpdateEncounter } from 'services/appointment';
import { fetchPatientSymptoms } from 'services/symptoms';
import {
  deleteLabResult,
  uploadLabResult,
  fetchPatientLabs,
} from 'services/labResults';

import { getRandomKey, getTabIndex } from 'utils';

import { routes } from 'routers';

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
import GeneralInformation from 'components/CreateEncounter/GeneralInformation';
import { ColumnContainer } from 'components/CreateEncounter/styles';

const PATIENT_DETAILS_TABS = {
  READINGS: 'Readings',
  NOTES: 'Notes',
  SYMPTOMS: 'Symptoms',
  LAB_RESULTS: 'Lab Results',
};

const tabMenu = [
  {
    name: PATIENT_DETAILS_TABS.NOTES,
  },
  {
    name: PATIENT_DETAILS_TABS.PRESCRIPTION,
  },
  {
    name: PATIENT_DETAILS_TABS.READINGS,
  },
  {
    name: PATIENT_DETAILS_TABS.SYMPTOMS,
  },
  {
    name: PATIENT_DETAILS_TABS.LAB_RESULTS,
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
  width: 33.33%;
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
  overflow-x: scroll;
  @media (max-width: 768px) {
    margin-top: 1.25rem;
  }
`;

const EachTab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${(props) => (props.selected ? '2px solid #22335E' : 'none')};
  color: ${(props) => (props.selected ? '#22335E' : '#657396')};
  cursor: pointer;
  padding: 0rem 0.5rem;
  white-space: nowrap;
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
  labResults: 'labResults',
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
  const [labResults, setLabResults] = useState([]);
  const [labs, setLabs] = useState([]);

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

    const fetchLabs = async (patientId) => {
      try {
        const response = await fetchPatientLabs(patientId);

        setLabs(response.data.labs);
      } catch (err) {
        // TODO: Handle err.
      }
    };

    fetchSymptoms(patientId);
    fetchLabs(patientId);
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

  const handleFileSelect = async (e) => {
    try {
      const files = e.target.files;
      if (appointmentId) {
        setIsNoteSaved(false);

        const labResultResponse = await uploadLabResult(
          patientId,
          appointmentId,
          [...files],
        );

        const newFiles = labResultResponse.data.files.map((file) => ({
          name: file.replace('laboratory/', ''),
          file,
        }));

        setLabResults((labResult) => [...labResult, ...newFiles]);
      } else {
        setIsNoteLoading(true);
        setIsNoteSaved(false);

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

        const labResultResponse = await uploadLabResult(
          patientId,
          organizationEventBookingId,
          [...files],
        );

        const newFiles = labResultResponse.data.files.map((file) => ({
          name: file.replace('laboratory/', ''),
          file,
        }));

        setLabResults((labResult) => [...labResult, ...newFiles]);
      }
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsNoteSaved(true);
    }
  };

  const handleRemoveFile = async (selectedFile) => {
    try {
      setIsNoteSaved(false);
      const results = labResults.filter(
        (result) => result.name !== selectedFile.name,
      );
      const labImageUrl = results.map((result) => result.file);

      await deleteLabResult(appointmentId, { labImageUrl });

      setLabResults(results);
    } catch (err) {
      // TODO: Handle error.
    } finally {
      setIsNoteSaved(true);
    }
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
            <Column>
              <GeneralInformation data={patientData} dispatch={dispatch} />
            </Column>
            <Column>
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
                <Tab
                  role="button"
                  tabIndex={getTabIndex()}
                  onClick={() => setVitalsActiveTab(VITALS_TABS.labResults)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setVitalsActiveTab(VITALS_TABS.labResults);
                    }
                  }}
                  active={vitalsActiveTab === VITALS_TABS.labResults}>
                  Lab Results
                </Tab>
              </TabContainer>
              <ColumnContainer>
                {vitalsActiveTab === VITALS_TABS.vitals && (
                  <GraphicalReadings data={patientData} />
                )}
                {vitalsActiveTab === VITALS_TABS.symptoms && (
                  <Symptoms symptoms={symptoms} />
                )}
                {vitalsActiveTab === VITALS_TABS.labResults && (
                  <LabResults labs={labs} />
                )}
              </ColumnContainer>
            </Column>
            <Column>
              <PatientNotes
                note={note}
                handleNoteChange={handleNoteChange}
                pastNotes={patientData.pastNotes}
                isNoteLoading={isNoteLoading}
                isNoteSaved={isNoteSaved}
                labResults={labResults}
                setLabResults={setLabResults}
                handleFileSelect={handleFileSelect}
                handleRemoveFile={handleRemoveFile}
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
                    <TabName>{tab?.name}</TabName>
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
                  labResults={labResults}
                  setLabResults={setLabResults}
                  handleFileSelect={handleFileSelect}
                  handleRemoveFile={handleRemoveFile}
                />
              )}
              {selectedTab === PATIENT_DETAILS_TABS.SYMPTOMS && (
                <Symptoms symptoms={symptoms} />
              )}
              {selectedTab === PATIENT_DETAILS_TABS.LAB_RESULTS && (
                <LabResults labs={labs} />
              )}
            </ContentWrap>
          </MobileViewMedInfoWrap>
        </PatientDetailsWrapper>
      </Wrapper>
    </DashboardLayout>
  );
}

export default CreateEncounter;
