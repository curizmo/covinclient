import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// This pop up is temporary , just for demo purpose.
const DidModal = ({
  patientDid,
  shareInAppFlag,
  encounterId,
  open,
  onSaveDid,
  onClose,
}) => {
  const [did, setDid] = useState(patientDid);
  const [shareInApp, setShareInApp] = useState(shareInAppFlag);

  const close = () => {
    setDid(patientDid);
    onClose();
  };

  const save = () => {
    onSaveDid({ did, shareInApp });
  };
  const handleChange = (e) => {
    setDid(e.target.value);
  };

  const handleShareInAppSelect = (e) => {
    if (e.target.checked) {
      setDid('');
    }
    setShareInApp(e.target.checked);
  };

  React.useEffect(() => {
    if (shareInAppFlag) {
      setDid('');
    } else {
      setDid(patientDid);
    }
    setShareInApp(shareInAppFlag);
  }, [encounterId]);

  return (
    <Modal isOpen={open}>
      <ModalHeader>Please enter Did</ModalHeader>
      <ModalBody>
        <Input
          type="text"
          disabled={shareInApp}
          value={did}
          onChange={handleChange}
        />
        <div>
          <span
            style={{
              display: 'block',
              marginTop: '10px',
            }}>
            Share In App ?
            <input
              type="checkbox"
              checked={shareInApp}
              style={{ marginLeft: '10px' }}
              onChange={handleShareInAppSelect}
            />
          </span>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={save}>
          Ok
        </Button>
        <Button color="light" onClick={close}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

DidModal.propTypes = {
  did: PropTypes.string,
};

export { DidModal };
