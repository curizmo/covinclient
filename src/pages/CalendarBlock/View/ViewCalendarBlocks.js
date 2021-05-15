import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { useDispatch } from 'react-redux';

import { DashboardLayout } from '../../../components/common/Layout';

import {
  fetchCalendarBlocks,
  removeCalendarBlock,
} from 'services/practitioner';

import { showSpinner, hideSpinner } from 'actions/spinner';
import { LinkButton } from 'components/common/Button';

import { routes } from 'routers';

const tableHeader = [
  'Start Date',
  'End Date',
  'Start Time',
  'End Time',
  'Is Recurring',
  'Recurrence Type',
  'Days',
  'Reason',
  'Action',
];

const ViewCalendarBlock = () => {
  const [calendarBlocks, setCalendarBlocks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCalendarBlock, setSelectedCalendarBlock] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getCalendarBlocks();
  }, []);

  const getCalendarBlocks = async () => {
    try {
      dispatch(showSpinner());
      const response = await fetchCalendarBlocks();

      setCalendarBlocks(response.data.calendarBlocks);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const openDeleteModal = (calendarBlockId) => {
    setShowDeleteModal(true);
    setSelectedCalendarBlock(calendarBlockId);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCalendarBlock(null);
  };

  const deleteCalendarBlock = async () => {
    try {
      dispatch(showSpinner());
      await removeCalendarBlock(selectedCalendarBlock);

      closeDeleteModal();
      dispatch(hideSpinner());
      getCalendarBlocks();
    } catch (err) {
      // TODO: Handle error.
      dispatch(hideSpinner());
      closeDeleteModal();
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between mb-3">
        <h2 className="mb-3">Calendar Blocks</h2>
        <LinkButton to={routes.createCalendarBlock.path}>
          Create Calendar Block
        </LinkButton>
      </div>
      <Modal isOpen={showDeleteModal} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>
          Delete Calendar Block?
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this calendar block?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteCalendarBlock}>
            Yes
          </Button>
          <Button color="primary" onClick={closeDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {calendarBlocks && calendarBlocks.length ? (
        <Table hover responsive>
          <thead>
            <tr>
              {tableHeader.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarBlocks.map((calendarBlock) => {
              const {
                id,
                startDate,
                endDate,
                startTime,
                endTime,
                isRecurring,
                recurrenceType,
                reason,
                days,
              } = calendarBlock;

              return (
                <tr key={id}>
                  <td>{startDate}</td>
                  <td>{endDate || '-'}</td>
                  <td>{startTime}</td>
                  <td>{endTime}</td>
                  <td>{isRecurring ? 'Yes' : 'No'}</td>
                  <td>{recurrenceType || '-'}</td>
                  <td>{days || '-'}</td>
                  <td>{reason || '-'}</td>
                  <td>
                    <LinkButton
                      className="mr-2"
                      to={`/calendar-block/edit/${id}`}>
                      Edit
                    </LinkButton>
                    <Button color="danger" onClick={() => openDeleteModal(id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p className="pl-4">No calendar blocks.</p>
      )}
    </DashboardLayout>
  );
};

export default ViewCalendarBlock;
