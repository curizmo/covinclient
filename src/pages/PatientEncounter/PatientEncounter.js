import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Table } from 'reactstrap';

import { DashboardLayout } from 'components/common/Layout';
import { EncounterModal } from 'pages/Encounters/EncounterModal';

import { showSpinner, hideSpinner } from 'actions/spinner';
import * as encounterService from 'services/patient';
import { getReadableDate } from 'utils/dateTime';

function PatientEncounter() {
  const dispatch = useDispatch();
  const [encounters, setEncounters] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const tableHeader = ['Date', 'Practitioner', 'Appointment Type', ''];

  const fetchEncounter = async () => {
    dispatch(showSpinner());
    try {
      const response = await encounterService.fetchUserEncounters();
      let { encounters } = response.data;

      encounters = encounters.map((encounter) => {
        const createdDate = getReadableDate(encounter.createdDate);
        return { ...encounter, createdDate };
      });

      setEncounters(encounters);
    } catch (err) {
      setEncounters([]);
    } finally {
      dispatch(hideSpinner());
    }
  };

  const handleViewNotes = (encounter) => {
    setSelectedAppointment(encounter.organizationEventBookingId);
  };

  const handleCloseEncounterModal = () => {
    setSelectedAppointment(null);
  };

  useEffect(() => {
    fetchEncounter();
  }, []);

  return (
    <DashboardLayout>
      {Boolean(selectedAppointment) && (
        <EncounterModal
          readOnly
          isOpen
          handleCloseEncounterModal={handleCloseEncounterModal}
          appointmentId={selectedAppointment}
        />
      )}
      <h2 className="mb-3">Encounters</h2>
      <Table hover responsive className="table-container">
        <thead className="table-header">
          <tr>
            {tableHeader.map((header) => (
              <th className="bg-light" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {encounters.map((encounter) => {
            const {
              createdDate,
              organizationEventName,
              organizationEventBookingId,
              displayName,
            } = encounter;

            return (
              <tr key={organizationEventBookingId}>
                <td>{createdDate}</td>
                <td>{displayName}</td>
                <td>{organizationEventName}</td>
                <td>
                  <Button onClick={() => handleViewNotes(encounter)}>
                    View Encounter
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </DashboardLayout>
  );
}

export default PatientEncounter;
