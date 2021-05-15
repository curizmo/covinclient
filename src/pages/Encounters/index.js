import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, ListGroupItem, Button, Table } from 'reactstrap';
import { FaPhone } from 'react-icons/fa';

import { DashboardLayout } from 'components/common/Layout';
import { LinkButton } from 'components/common/Button';
import { Referral } from 'components/Referral';
import { EncounterModal } from './EncounterModal';
import { ViewReferrals } from './ViewReferrals';
import { CreatePatientTask } from 'components/PatientTaskModal/CreatePatientTask';
import { Tasks } from './Tasks';

import { showSpinner, hideSpinner } from 'actions/spinner';

import {
  fetchPatient,
  fetchPatientEncountersByPractitionerUserId,
} from 'services/patient';
import { getPatientTasks } from 'services/patientTask';

import { getUser } from 'selectors';

import { getReadableDate } from 'utils/dateTime';

const Encounters = () => {
  const match = useRouteMatch();
  const [patient, setPatient] = useState({});
  const [state, setState] = useState({
    encounters: [],
    note: '',
    enableAddReferral: false,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedReferrals, setSelectedReferrals] = useState(null);
  const [displayAssignTaskModal, setDisplayAssignTaskModal] = useState(false);
  const [displayTasks, setDisplayTasks] = useState(false);
  const [tasks, setTasks] = useState([]);
  const user = useSelector(getUser);
  // const { sendToPatient } = useVeridaProvider();
  const dispatch = useDispatch();

  const fetchEncounters = async (patientId, userId) => {
    try {
      dispatch(showSpinner());

      const response = await fetchPatientEncountersByPractitionerUserId(
        patientId,
        userId,
      );

      let encounters = response.data;

      if (!encounters.length) {
        return;
      }

      encounters.sort((a, b) => {
        const aStartTime = new Date(a.eventStartTime).getTime();
        const bStartTime = new Date(b.eventStartTime).getTime();

        return bStartTime - aStartTime;
      });

      encounters = encounters.map((encounter) => ({
        ...encounter,
        isSelected: false,
        eventStartTime: getReadableDate(encounter.eventStartTime),
      }));

      setState({
        encounters,
      });
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const fetchPatientTasks = async (patientId) => {
    try {
      dispatch(showSpinner());
      const response = await getPatientTasks(patientId);

      const { tasks } = response.data;

      setTasks(tasks);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const getPatient = async (patientId) => {
    try {
      const response = await fetchPatient(patientId);

      setPatient({
        ...response.data,
        name: `${response.data.givenName} ${response.data.familyName}`,
      });
    } catch (err) {
      // TODO: Handle error
    }
  };

  useEffect(() => {
    fetchEncounters(match.params.patientId, user.NTOUserID);
  }, [match.params.patientId, user.NTOUserID]);

  useEffect(() => {
    getPatient(match.params.patientId);
    fetchPatientTasks(match.params.patientId);
  }, [match.params.patientId]);

  const handleViewNotes = (index) => {
    const selectedEncounter = encounters[index];

    setSelectedAppointment(selectedEncounter.organizationEventBookingId);
  };

  const handleCloseEncounterModal = () => {
    setSelectedAppointment(null);
  };

  const handleEncounterSelect = (selectedEncounter) => {
    const encounters = state.encounters.map((encounter) => ({
      ...encounter,
      isSelected:
        encounter.organizationEventBookingId ===
        selectedEncounter.organizationEventBookingId
          ? !encounter.isSelected
          : encounter.isSelected,
    }));

    const selectedEncounters = encounters
      .filter((encounter) => encounter.isSelected)
      .map((encounter) => encounter.organizationEventBookingId);

    setState({
      ...state,
      encounters,
      enableAddReferral: !!selectedEncounters.length,
      selectedEncounters,
    });
  };

  const handleViewReferrals = (referrals) => {
    setSelectedReferrals(referrals);
  };

  const handleCloseReferralModal = () => {
    setSelectedReferrals(null);
  };

  const { encounters, enableAddReferral, selectedEncounters } = state;

  const openAssignTaskModal = () => {
    setDisplayAssignTaskModal(true);
  };

  const closeAssignTaskModal = () => {
    setDisplayAssignTaskModal(false);
  };

  const handleEncounterTabClick = () => {
    setDisplayTasks(false);
  };

  const handleTaskTabClick = () => {
    setDisplayTasks(true);
  };

  return (
    <DashboardLayout>
      {displayAssignTaskModal && (
        <CreatePatientTask
          handleClose={closeAssignTaskModal}
          patient={patient}
        />
      )}
      {Boolean(selectedReferrals) && (
        <ViewReferrals
          isOpen
          handleCloseReferralModal={handleCloseReferralModal}
          referrals={selectedReferrals}
        />
      )}
      {Boolean(selectedAppointment) && (
        <EncounterModal
          isOpen
          handleCloseEncounterModal={handleCloseEncounterModal}
          appointmentId={selectedAppointment}
        />
      )}
      <div className="p-5">
        <h2 className="mb-3">Patient details:</h2>
        <ListGroup>
          <ListGroupItem>
            Name: <span className="font-weight-bold">{patient.name}</span>
          </ListGroupItem>
          <ListGroupItem>
            Email: <span className="font-weight-bold">{patient.email}</span>
          </ListGroupItem>
          <ListGroupItem>
            Phone:
            <span className="font-weight-bold">
              <FaPhone className="mx-2" size="0.8em" />
              {patient.phone}
            </span>
          </ListGroupItem>
        </ListGroup>
      </div>

      <div className="p-5">
        <div className="d-flex mb-3">
          <Button
            color="primary"
            className={`mr-3 ${displayTasks ? 'btn-light' : 'active'}`}
            onClick={handleEncounterTabClick}>
            Encounters
          </Button>
          <Button
            color="primary"
            className={`${displayTasks ? 'active' : 'btn-light'}`}
            onClick={handleTaskTabClick}>
            Tasks
          </Button>
        </div>
        <div className="mb-3">
          <LinkButton
            className="mr-2"
            to={`/patient/${match.params.patientId}/note/new`}>
            Create Encounter
          </LinkButton>
          <Button className="mr-2" onClick={openAssignTaskModal}>
            Assign Task
          </Button>
          {enableAddReferral && (
            <Referral
              btnText="Add Referral"
              appointments={selectedEncounters}
              patientId={match.params.patientId}
              patientUserId={user.NTOUserID}
              fetchEncounters={fetchEncounters}
            />
          )}
        </div>
        {displayTasks ? (
          <Tasks tasks={tasks} fetchTasks={fetchPatientTasks} />
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th></th>
                <th>Appointment Date</th>
                <th>Action</th>
                <th>Referrals</th>
              </tr>
            </thead>
            <tbody>
              {encounters.map((encounter, index) => {
                return (
                  <tr key={`${encounter.encounterId}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={encounter.isSelected}
                        onChange={() => handleEncounterSelect(encounter)}
                      />
                    </td>
                    <td>{encounter.eventStartTime}</td>
                    <td>
                      <Button onClick={() => handleViewNotes(index)}>
                        View Encounter
                      </Button>
                    </td>
                    <td>
                      {encounter.referrals && encounter.referrals.length ? (
                        <Button
                          onClick={() =>
                            handleViewReferrals(encounter.referrals)
                          }>
                          View Referrals
                        </Button>
                      ) : (
                        'No Referrals'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Encounters;
