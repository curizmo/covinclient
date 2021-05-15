import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const YesNoModal = ({
  show,
  handleYes,
  handleNo,
  close,
  text = {
    header: '',
    paragraphs: [],
    question: '',
  },
  buttons = {
    yes: 'Yes',
    no: 'No',
  },
}) => {
  return (
    <Modal isOpen={show} centered>
      {text.header ? (
        <ModalHeader>
          <h5>{text.header}</h5>
        </ModalHeader>
      ) : null}
      <ModalBody className="py-3">
        {text.paragraphs
          ? text.paragraphs.map((paragraph, index) => (
              <p key={`login_para_${index}`}>{paragraph}</p>
            ))
          : null}
        {text.question ? <p className="pt-3">{text.question}</p> : null}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleNo || close}>
          {buttons.no}
        </Button>
        <Button color="success" onClick={handleYes || close}>
          {buttons.yes}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

YesNoModal.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.shape({
    header: PropTypes.string,
    paragraphs: PropTypes.arrayOf(PropTypes.string),
    question: PropTypes.string,
  }),
  handleYes: PropTypes.func,
  handleNo: PropTypes.func,
  close: PropTypes.func,
  buttons: PropTypes.shape({
    yes: PropTypes.string,
    no: PropTypes.string,
  }),
};

export { YesNoModal };
