import React, { useState } from 'react';
import { Table, Button } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { TASK_STATUS_CLASSES } from '../../constants';

import { EditPatientTask } from 'components/PatientTaskModal/EditPatientTask';

import { hideSpinner, showSpinner } from 'actions/spinner';

import { deleteTask } from 'services/patientTask';

const tableHeader = [
  'Title',
  'Practitioner',
  'Start Date',
  'End Date',
  'Progress',
  'Action',
];

const Tasks = ({ tasks, fetchTasks }) => {
  const [displayTaskModal, setDisplayTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();

  const handleEditClick = (task) => {
    setDisplayTaskModal(true);
    setSelectedTask(task);
  };

  const closeTaskModal = () => {
    setDisplayTaskModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (task) => {
    try {
      dispatch(showSpinner());

      await deleteTask(task.id);

      fetchTasks(task.patientId);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  return (
    <>
      {displayTaskModal && (
        <EditPatientTask
          handleClose={closeTaskModal}
          task={selectedTask}
          fetchTasks={fetchTasks}
        />
      )}
      {tasks && tasks.length > 0 ? (
        <Table hover responsive>
          <thead>
            <tr>
              {tableHeader.map((header) => (
                <th key={header} className="sticky-top bg-light">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks &&
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{`${task.title}`}</td>
                  <td>{`${task.practitioner.displayName}`}</td>
                  <td>{task.startDate}</td>
                  <td>{task.endDate}</td>
                  <td
                    className={
                      task.completedTasks === task.totalTasks
                        ? TASK_STATUS_CLASSES.Completed
                        : TASK_STATUS_CLASSES.Pending
                    }>
                    {`${task.completedTasks}/${task.totalTasks}`}
                  </td>
                  <td>
                    <>
                      <Button
                        className="btn-small ml-2"
                        onClick={() => handleEditClick(task)}>
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        className="btn-small ml-2"
                        onClick={() => handleDeleteTask(task)}>
                        Delete
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
        <p className="p-3">No tasks</p>
      )}
    </>
  );
};

export { Tasks };
