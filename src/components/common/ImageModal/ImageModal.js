import React from 'react';
import * as PropTypes from 'prop-types';

import { Modal } from '../Modal';

const ImageModal = ({ imageUrl, handleClose }) => {
  return (
    <Modal close={handleClose} className="z-1060">
      <img className="img-fluid" src={imageUrl} alt="" />
    </Modal>
  );
};

ImageModal.propTypes = {
  imageUrl: PropTypes.string,
  handleClose: PropTypes.func,
};

export { ImageModal };
