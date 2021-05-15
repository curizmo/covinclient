import React, { useEffect, useState } from 'react';
import * as WebcamComponent from 'react-webcam';
import { IoMdCamera, IoMdReverseCamera } from 'react-icons/io';
import * as PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { VIDEO_CONSTRAINTS, VIDEO_INPUT } from 'constants/index';

const WebcamContainer = ({
  isOpen,
  handleClose,
  webcamRef,
  handleImageClick,
}) => {
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: VIDEO_CONSTRAINTS.ENVIRONMENT,
  });
  const [hasMultipleVideoDevices, setHasMultipleVideoDevices] = useState(false);

  WebcamContainer.handleClickOutside = () => handleClose();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices();
    getMediaDevices();
  }, []);

  const getMediaDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === VIDEO_INPUT,
    );

    setHasMultipleVideoDevices(videoDevices.length > 1);
  };

  const toggleVideoDevice = () => {
    setVideoConstraints({
      facingMode:
        videoConstraints.facingMode === VIDEO_CONSTRAINTS.USER
          ? VIDEO_CONSTRAINTS.ENVIRONMENT
          : VIDEO_CONSTRAINTS.USER,
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} centered>
      <ModalHeader className="p-1" toggle={handleClose} />
      <ModalBody className="p-0">
        <WebcamComponent
          className="w-100"
          ref={webcamRef}
          screenshotFormat={'image/png'}
          videoConstraints={videoConstraints}
        />
      </ModalBody>
      <ModalFooter className="justify-content-center modal-footer p-1 border-0">
        <IoMdCamera
          size={48}
          onClick={handleImageClick}
          className="text-danger border rounded-circle p-1"
        />
        {hasMultipleVideoDevices && (
          <IoMdReverseCamera
            size={48}
            onClick={toggleVideoDevice}
            className="border rounded-circle p-1"
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

// This is a temporary solution for react-onclickoutside to work.
WebcamContainer.prototype = {};

const clickOutsideConfig = {
  handleClickOutside: () => WebcamContainer.handleClickOutside,
};

const Webcam = onClickOutside(WebcamContainer, clickOutsideConfig);

WebcamContainer.propTypes = {
  isOpen: PropTypes.bool,
  handleImageClick: PropTypes.func,
  handleClose: PropTypes.func,
};

export { Webcam };
