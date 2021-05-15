import React from 'react';
import * as PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import { CloseButton } from '../Button/CloseButton';
import { StyledModal } from './style';

const ModalContainer = ({
  children,
  className = '',
  close = () => {},
  modalClass = '',
  isCloseButton = false,
}) => {
  ModalContainer.handleClickOutside = () => close();

  return (
    <StyledModal className={className}>
      <section
        role="presentation"
        className={`modal-main rounded ${modalClass}`}>
        {children}
        {isCloseButton ? <CloseButton onClose={close} /> : null}
      </section>
    </StyledModal>
  );
};

ModalContainer.propTypes = {
  modalClass: PropTypes.string,
  close: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  className: PropTypes.string,
  isCloseButton: PropTypes.bool,
};

// This is a temporary solution for react-onclickoutside to work.
ModalContainer.prototype = {};

const clickOutsideConfig = {
  handleClickOutside: () => ModalContainer.handleClickOutside,
};

const Modal = onClickOutside(ModalContainer, clickOutsideConfig);

export { Modal };
