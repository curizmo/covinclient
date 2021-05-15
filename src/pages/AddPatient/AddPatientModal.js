import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { ONE_SECOND_IN_MILLISECONDS } from '../../constants';

import { InputField } from 'components/common/InputField';

import * as patientService from 'services/patient';
import * as patientOrganizationService from 'services/patientOrganization';

import { hideSpinner, showSpinner } from 'actions/spinner';

const AddPatientModal = ({ closeModal }) => {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const dispatch = useDispatch();

  const searchPatients = async (search) => {
    try {
      const response = await patientService.searchPatients(search);

      const { patients } = response.data;

      setPatients(patients);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const delayedSearchQuestions = useCallback(
    debounce(searchPatients, ONE_SECOND_IN_MILLISECONDS),
    [],
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    delayedSearchQuestions(e.target.value);
  };

  const handleAddPatient = async (patient) => {
    try {
      dispatch(showSpinner());

      await patientOrganizationService.addPatientToPractitionerOrganization(
        patient.patientId,
      );

      searchPatients(search);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  return (
    <Modal isOpen toggle={closeModal}>
      <ModalHeader>Search for a patient</ModalHeader>
      <ModalBody>
        <InputField
          name="search"
          value={search}
          type="text"
          placeholder="Search patient"
          onChange={handleSearchChange}
        />

        <div>
          <ul className="p-0">
            {patients &&
              patients.map((patient) => {
                return (
                  <li
                    className="my-2 d-flex justify-content-between"
                    key={patient.patientId}>
                    <span>
                      {`- ${patient.givenName} ${patient.familyName} (${patient.email})`}
                    </span>
                    <Button
                      size="sm"
                      className="ml-2"
                      onClick={() => handleAddPatient(patient)}>
                      Add
                    </Button>
                  </li>
                );
              })}
          </ul>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button type="button" onClick={closeModal}>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
};

AddPatientModal.propTypes = {
  closeModal: PropTypes.func,
};

export { AddPatientModal };
