import React from 'react';
import * as PropTypes from 'prop-types';
import { IoIosClose } from 'react-icons/io';

import { StyledCloseButton } from './style';

const CloseButton = ({ onClose }) => {
  return (
    <StyledCloseButton onClick={onClose}>
      <IoIosClose className="bg-blue-200 rounded-full" />
    </StyledCloseButton>
  );
};

CloseButton.propTypes = {
  onClose: PropTypes.func,
};

export { CloseButton };
