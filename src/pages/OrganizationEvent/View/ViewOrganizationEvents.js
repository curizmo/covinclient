import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { DashboardLayout } from '../../../components/common/Layout';

import { fetchPractitionerOrganizations } from 'services/practitioner';

import { showSpinner, hideSpinner } from 'actions/spinner';
import { LinkButton } from 'components/common/Button';
import { InputField } from 'components/common/InputField';

import { routes } from 'routers';

import { getUser } from 'selectors';
import {
  getOrganizationEvents,
  removeOrganizationEvent,
} from 'services/organizationEvent';

const tableHeader = ['Name', 'Action'];

const ViewOrganizationEvents = () => {
  const [organizationEvents, setOrganizationEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedOrganizationEvent, setSelectedOrganizationEvent] =
    useState(null);
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    if (user.NTOUserID) {
      getOrganizations(user.NTOUserID);
    }
  }, [user.NTOUserID]);

  useEffect(() => {
    if (selectedOrganization) {
      fetchOrganizationEvents(selectedOrganization);
    }
  }, [selectedOrganization]);

  const getOrganizations = async (ntoUserId) => {
    try {
      dispatch(showSpinner());

      const response = await fetchPractitionerOrganizations(ntoUserId);

      const { organizations } = response.data;

      setOrganizations(organizations);
      setSelectedOrganization(organizations[0].organizationId);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const fetchOrganizationEvents = async (organizationId) => {
    try {
      dispatch(showSpinner());

      const response = await getOrganizationEvents(organizationId);

      setOrganizationEvents(response.data.organizationEvents);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const openDeleteModal = (organizationEventId) => {
    setShowDeleteModal(true);
    setSelectedOrganizationEvent(organizationEventId);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedOrganizationEvent(null);
  };

  const deleteOrganizationEvent = async () => {
    try {
      dispatch(showSpinner());

      await removeOrganizationEvent(selectedOrganizationEvent);

      closeDeleteModal();
      dispatch(hideSpinner());
      fetchOrganizationEvents(selectedOrganization);
    } catch (err) {
      // TODO: Handle error.
      dispatch(hideSpinner());
      closeDeleteModal();
    }
  };

  const handleOrganizationSelect = (organizationId) => {
    setSelectedOrganization(organizationId);
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between mb-3">
        <h2 className="mb-3">Events</h2>
        <LinkButton to={routes.createOrganizationEvent.path}>
          Create Event
        </LinkButton>
      </div>
      <Modal isOpen={showDeleteModal} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>Delete Event?</ModalHeader>
        <ModalBody>Are you sure you want to delete this event?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteOrganizationEvent}>
            Yes
          </Button>
          <Button color="primary" onClick={closeDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <InputField
        inline={false}
        type="select"
        onBlur={handleOrganizationSelect}
        onChange={handleOrganizationSelect}
        value={selectedOrganization}
        className="p-2">
        {organizations.map((organization) => (
          <option
            key={organization.organizationId}
            value={organization.organizationId}>
            {organization.organizationName}
          </option>
        ))}
      </InputField>
      {organizationEvents && organizationEvents.length ? (
        <Table hover responsive>
          <thead>
            <tr>
              {tableHeader.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {organizationEvents.map((event) => {
              const { organizationEventId, organizationEventName } = event;

              return (
                <tr key={organizationEventId}>
                  <td>{organizationEventName}</td>
                  <td>
                    <LinkButton
                      className="mr-2"
                      to={`/events/edit/${organizationEventId}`}>
                      Edit
                    </LinkButton>
                    <Button
                      color="danger"
                      onClick={() => openDeleteModal(organizationEventId)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p className="pl-4">No events.</p>
      )}
    </DashboardLayout>
  );
};

export { ViewOrganizationEvents };
