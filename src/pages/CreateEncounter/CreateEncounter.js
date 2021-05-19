import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { Col, Container, Form, Row } from 'reactstrap';

import { DashboardLayout } from 'components/common/Layout';
import {
  PatientNotes,
  PersonalInformation,
  PatientPrescription,
  GraphicalReadings,
} from 'components/CreateEncounter';

import { fetchPatient, hideSpinner, showSpinner } from 'actions';
import { getPatient, getIsEncounterUpdated, getUser } from 'selectors';
import { routes } from 'routers';
import notesIcon from 'assets/images/svg-icons/notesIcon.svg';
import lineGraphIcon from 'assets/images/svg-icons/lineGraphIcon.svg';
import prescriptionIcon from 'assets/images/svg-icons/prescriptionIcon.svg';
import notesSelectedIcon from 'assets/images/svg-icons/notes-selected.svg';
import lineGraphSelectedIcon from 'assets/images/svg-icons/reading-selected.svg';
import prescriptionSelectedIcon from 'assets/images/svg-icons/orders-selected.svg';

import {
  createEncounter,
  fetchPatientEncountersByPractitionerUserId,
} from 'services/patient';
import { fetchPatientMedicationByPractitionerUserId } from 'services/patientMedication';
import { debounce } from 'lodash';
import { createOrUpdateEncounter } from 'services/appointment';

const PATIENT_DETAILS_TABS = {
  READINGS: 'Readings',
  NOTES: 'Notes',
  PRESCRIPTION: 'Prescription',
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
  const { register, handleSubmit } = useForm({ mode: 'onBlur' });
  const [note, setNote] = useState('');
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [labsList, setLabsList] = useState([]);
  const [pastNotes, setPastNotes] = useState([]);
  const [pastPrescriptions, setPastPrescriptions] = useState([]);
  const [appointmentId, setAppointmentId] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(false);

  const tabMenu = [
    {
      name: PATIENT_DETAILS_TABS.NOTES,
      icon: notesIcon,
      activeIcon: notesSelectedIcon,
    },
    {
      name: PATIENT_DETAILS_TABS.PRESCRIPTION,
      icon: prescriptionIcon,
      activeIcon: prescriptionSelectedIcon,
    },
    {
      name: PATIENT_DETAILS_TABS.READINGS,
      icon: lineGraphIcon,
      activeIcon: lineGraphSelectedIcon,
    },
  ];
  //@toDo use selectedTab, setSelectedTab, tabMenu for mobile view
  console.log(selectedTab, setSelectedTab, tabMenu);

  const handleSave = () => {
    dispatch(
      updateEncounter({
        patientId,
        riskLevel,
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
      }),
    );
  };

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
          riskLevel,
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
    [appointmentId, prescriptionList, riskLevel, patientId],
  );

  return (
    <DashboardLayout>
      <div className="header mb-1 d-flex justify-content-between px-3 py-2">
        <h3 className="page-title">Patients</h3>
      </div>
      <Container className="p-0">
        <Form onSubmit={handleSubmit(handleSave)}>
          <Row>
            <Col md={{ size: 12 }}>
              <PersonalInformation
                data={patientData}
                register={register}
                setRiskLevel={setRiskLevel}
                riskLevel={riskLevel}
                dispatch={dispatch}
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 4 }}>
              <GraphicalReadings data={patientData} />
            </Col>
            <Col md={{ size: 4 }}>
              <PatientNotes
                note={note}
                handleNoteChange={handleNoteChange}
                pastNotes={pastNotes}
                isNoteLoading={isNoteLoading}
                isNoteSaved={isNoteSaved}
              />
            </Col>
            <Col md={{ size: 4 }}>
              <PatientPrescription
                data={patientData}
                prescriptionList={prescriptionList}
                setPrescriptionList={setPrescriptionList}
                pastPrescriptions={pastPrescriptions}
                labsList={labsList}
                setLabsList={setLabsList}
                appointmentId={appointmentId}
                setAppointmentId={setAppointmentId}
                patientId={patientId}
              />
            </Col>
          </Row>
        </Form>
      </Container>
    </DashboardLayout>
  );
}

export default CreateEncounter;
