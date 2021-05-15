import React, { useState, useCallback } from 'react';
import ReactTooltip from 'react-tooltip';
import * as PropTypes from 'prop-types';
import { debounce } from 'lodash';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Media,
  Row,
  Col,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import { InputField } from 'components/common/InputField';

import { searchPractitioner } from 'services/practitioner';
import { createReferral } from 'services/referral';

import { getUser } from 'selectors';

import { REFERRAL_STATUS } from '../constants';

const Referral = ({
  btnText = 'Refer Patient',
  patientId,
  appointments = [],
  disabled = false,
  fetchEncounters = () => {},
  patientUserId,
}) => {
  const [practitioners, setPractitioners] = useState([]);
  const [practitionerName, setPractitionerName] = useState('');
  const [selectedPractitioner, setSelectedPractitioner] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [modal, setModal] = useState(false);
  const user = useSelector(getUser);
  const toggleModal = () => setModal(!modal);

  const handlePractitionerSearch = async (name) => {
    if (!name) {
      setPractitioners([]);

      return;
    }

    const response = await searchPractitioner(name);

    const practitioners = response.data.practitioners.filter(
      (practitioner) =>
        practitioner.ntoUserId.toLowerCase() !== user.NTOUserID.toLowerCase(),
    );

    setPractitioners(practitioners);
  };
  const delayedHandlePractitionerSearch = useCallback(
    debounce(handlePractitionerSearch, 1000),
    [],
  );

  const handlePractionerNameChange = (e) => {
    setPractitionerName(e.target.value);
    delayedHandlePractitionerSearch(e.target.value);
  };

  const handlePhysicianSelect = (practitioner) => {
    setSelectedPractitioner(practitioner);
    setPractitioners([]);
    setPractitionerName('');
  };

  const handleKeyPress = (e, practitioner) => {
    if (e.key === 'Enter') {
      handlePhysicianSelect(practitioner);
    }
  };

  const handleSetReason = (e) => setReason(e.target.value);

  const handleSetDescription = (e) => setDescription(e.target.value);

  const handleSubmit = async () => {
    const payload = {
      appointments: appointments,
      reason,
      description,
      practitionerId: selectedPractitioner.practitionerId,
      patientId,
      referralStatus: REFERRAL_STATUS.pending,
    };

    await createReferral(payload);

    fetchEncounters(patientId, patientUserId);

    setModal(false);
  };

  const canSubmit = Boolean(
    patientId && selectedPractitioner && selectedPractitioner.practitionerId,
  );

  return (
    <>
      <Button className="mr-2" onClick={toggleModal} disabled={disabled}>
        {btnText}
      </Button>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{btnText}</ModalHeader>
        <ModalBody>
          <div className="relative">
            <InputField
              labelSize={3}
              title="Search Practitioner"
              type="text"
              value={practitionerName}
              onChange={handlePractionerNameChange}
              placeholder="Search practitioner"
            />
            {practitioners && practitioners.length ? (
              <div className="bg-white mb-3">
                {practitioners.map((practitioner) => {
                  return (
                    <Button
                      key={`${practitioner.displayName}`}
                      color="info"
                      className="mb-1"
                      onClick={() => handlePhysicianSelect(practitioner)}
                      onKeyPress={(e) => handleKeyPress(e, practitioner)}
                      role="button"
                      tabIndex={0}>
                      <Row>
                        {practitioner.profilePicture ? (
                          <Col xs="1" m="1" lg="1" className="mr-1">
                            <Media
                              object
                              src={`${practitioner.profilePicture}`}
                              className="referral-option-image"
                              alt={`${practitioner.displayName}`}
                            />
                          </Col>
                        ) : null}
                        <Col
                          className="referral-detail ml-1"
                          data-tip
                          data-for={`${practitioner.displayName}`}>
                          {`${practitioner.displayName} (${practitioner.specialty})`}
                          <ReactTooltip
                            id={`${practitioner.displayName}`}
                            place="bottom"
                            effect="float">
                            {practitioner.email}
                          </ReactTooltip>
                        </Col>
                      </Row>
                    </Button>
                  );
                })}
              </div>
            ) : null}
            <InputField
              labelSize={3}
              title="Practitioner:"
              type="text"
              value={selectedPractitioner?.displayName || ''}
              readOnly
            />
            <InputField
              labelSize={3}
              title="Reason"
              type="text"
              value={reason}
              onChange={handleSetReason}
              placeholder="Reason"
            />
            <InputField
              labelSize={3}
              title="Description"
              type="textarea"
              className="border p-2 w-full h-32"
              placeholder="Description"
              onChange={handleSetDescription}
              value={description}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit} disabled={!canSubmit}>
            Refer Patient
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

Referral.propTypes = {
  btnText: PropTypes.string,
  patientId: PropTypes.string,
  appointments: PropTypes.array,
  disabled: PropTypes.bool,
  fetchEncounters: PropTypes.func,
  patientUserId: PropTypes.string,
};

export { Referral };
