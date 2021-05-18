import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import {
  PatientNotes,
  PersonalInformation,
  PatientPrescription,
  GraphicalReadings,
} from 'components/CreateEncounter';
import { GraphicalRepresentation } from 'components/GraphicalRepresentation';
import {
  fetchPatient,
  hideSpinner,
  showSpinner,
  updateEncounter,
} from 'actions';
import { fetchPatientEncountersByPractitionerUserId } from 'services/patient';
import { fetchPatientMedicationByPractitionerUserId } from 'services/patientMedication';
import { getPatient, getIsEncounterUpdated, getUser } from 'selectors';
import { routes } from 'routers';
import { getRandomKey } from 'utils';
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
import { DashboardLayout } from 'components/common/Layout';

const PatientDetailFormat = {
  name: 'Latika Dhar',
  mob: 8868911234,
  gender: 'F',
  age: 56,
  weight: 60,
  height: 156, //In cm
  currentStatus: 'Active',
  patientSince: '12/04/2021',
  knownAllergies: ['Shell fish'],
  familyHistory: [' Coronary artery disease'],
  preExisting: ['Diabetes', ' Coronary artery disease'],
  address: 'abc road, new delhi',
  riskLevel: 'High',
  lastUpdated: '03/05/2021 ,6.05am',
  patientParameterStatus: 'Completed',
  //{Initiated-when user initiates covid screening,
  // Pending-when patient hasnt completed his vitals fill up,
  // Completed- All the information is availaible}
  patientPastOrders: [
    { date: '05/05/2021', consultation: '6 Prescription' },
    { date: '05/05/2021', consultation: '1 Lab Test' },
  ],

  bodyParameterCheck: {
    temperature: {
      current: [{ label: 'Temp', value: 104 }],
      unit: 'F',
      data: [
        { label: 'May 1', value: 97 },
        { label: 'May 2', value: 98 },
        { label: 'May 3', value: 97 },
        { label: 'May 4', value: 102 },
        { label: 'May 5', value: 100 },
        { label: 'May 6', value: 101.9 },
        { label: 'May 7', value: 102 },
        { label: 'May 8', value: 102 },
        { label: 'May 9', value: 102 },
      ],
    },
    spO2: {
      current: [{ label: 'SpO2', value: '81' }],
      unit: '%',
      data: [
        { label: 'May 1', value: 80 },
        { label: 'May 2', value: 80 },
        { label: 'May 3', value: 78 },
        { label: 'May 4', value: 76 },
        { label: 'May 5', value: 78 },
        { label: 'May 6', value: 81 },
      ],
    },
    'Pulse Rate': {
      current: [{ label: 'Pulse Rate', value: '68' }],
      unit: 'bpm',
      data: [
        { label: 'May 3', value: 81 },
        { label: 'May 4', value: 70 },
        { label: 'May 5', value: 72 },
        { label: 'May 6', value: 71 },
        { label: 'May 7', value: 65 },
        { label: 'May 8', value: 68 },
      ],
    },
    'Blood Pressure': {
      current: [
        { label: 'Low Blood Pressure', value: 65 },
        { label: 'High Blood Pressure', value: 80 },
      ],
      data: [
        { label: 'May 3', low: 23, high: 14 },
        { label: 'May 4', low: 25, high: 18 },
        { label: 'May 5', low: 26, high: 16 },
        { label: 'May 6', low: 81, high: 12 },
        { label: 'May 7', low: 12, high: 27 },
        { label: 'May 8', low: 15, high: 11 },
      ],

      info: [],
      labels: [
        { label: 'low', value: 'low' },
        { label: 'high', value: 'high' },
      ],
    },
    'Respiratory Rate': {
      current: [{ label: 'Respiratory Rate', value: '20' }],
      data: [
        { label: 'May 3', value: 16 },
        { label: 'May 4', value: 18 },
        { label: 'May 5', value: 18 },
        { label: 'May 6', value: 21 },
        { label: 'May 7', value: 14 },
        { label: 'May 8', value: 20 },
      ],
    },
  },
};

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
  const [pastNotes, setPastNotes] = useState([]);
  const [pastPrescriptions, setPastPrescriptions] = useState([]);

  const handleSave = () => {
    dispatch(
      updateEncounter({
        patientId,
        riskLevel,
        labs: labsList,
        prescriptionList: JSON.stringify(prescriptionList),
        note,
      }),
    );
  };

  useEffect(() => {
    setRiskLevel(patientData?.status);
  }, [patientData]);

  useEffect(() => {
    fetchPatientEncounters(patientId, user.NTOUserID);
    fetchPatientPrescriptions(patientId, user.NTOUserID);
  }, [patientId, user.NTOUserID]);

  useEffect(() => {
    dispatch(fetchPatient({ patientId }));
  }, [dispatch, patientId]);

  useEffect(() => {
    if (isEncounterUpdated) {
      history.push(routes.patients.path);
    }
  }, [isEncounterUpdated]);

  const fetchPatientEncounters = async (patientId) => {
    try {
      dispatch(showSpinner());
      const response = await fetchPatientEncountersByPractitionerUserId(
        patientId,
        user.NTOUserID,
      );

      setPastNotes(response.data);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const fetchPatientPrescriptions = async (patientId, ntoUserId) => {
    try {
      const response = await fetchPatientMedicationByPractitionerUserId(
        patientId,
        ntoUserId,
      );

      setPastPrescriptions(response.data.prescriptions);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
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
            onSave={handleSave}
            riskLevel={riskLevel}
            setRiskLevel={setRiskLevel}
          />
          <MedInfoWrap>
            <Column>
              <GraphicalReadings data={PatientDetailFormat} />
            </Column>
            <Column>
              <PatientNotes
                note={note}
                handleNoteChange={handleNoteChange}
                pastNotes={pastNotes}
              />
            </Column>
            <Column>
              <PatientPrescription
                data={patientData}
                prescriptionList={prescriptionList}
                setPrescriptionList={setPrescriptionList}
                pastPrescriptions={pastPrescriptions}
                labsList={labsList}
                setLabsList={setLabsList}
              />
            </Column>
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
              {selectedTab === 'readings' && (
                <>
                  {PatientDetailFormat.patientParameterStatus ===
                    'Initiated' && (
                    <InitiateCovidScreenWrap>
                      <NoRecordStyling>No Record Availaible</NoRecordStyling>
                      <InitiateCovidScreening>
                        INITIATE COVID SCREENING
                      </InitiateCovidScreening>
                    </InitiateCovidScreenWrap>
                  )}
                  {PatientDetailFormat?.patientParameterStatus ===
                    'Pending' && (
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
                  {PatientDetailFormat?.patientParameterStatus ===
                    'Completed' && (
                    <GraphicalRepresentation
                      data={PatientDetailFormat}
                      spacingAroundComponent={spacingAroundComponent}
                      desktopViewLabelsForPatientsWithCurrentStats={
                        desktopViewLabelsForPatientsWithCurrentStats
                      }
                      preferenceList={{
                        //  showAxisX: false,
                        axisXLines: true,
                        showXAxisFonts: false,
                        showTooltip: true,
                        // dashedYAxis: true,
                        // showYAxisFonts: false,
                        // yAxisDomainFactor: 1.2,
                        xScalePaddingOuter: 5,
                        // maxRangeMultiplier: 1,
                        yAxisFontSize: 12,
                      }}
                    />
                  )}
                </>
              )}
              {selectedTab === 'notes' && <PatientNotes />}
              {selectedTab === 'orders' && (
                <PatientPrescription
                  data={PatientDetailFormat?.patientPastOrders}
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
