import React, { useRef, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDragable } from 'hooks/useDragable';

import { Button } from 'reactstrap';
import { FaPhone, FaAddressBook } from 'react-icons/fa';

const Call = ({
  onHangup,
  // onExpand,
  isDisabled,
  openDial,
  handleEndAppointment,
  onCall,
  currentAppointment,
  isAppointmentEnded,
}) => {
  const cardRef = useRef(null);
  useDragable(cardRef);

  useEffect(() => {
    if (
      !currentAppointment.isCallInProgress &&
      !currentAppointment.hasCallEnded
    ) {
      onCall(currentAppointment);
    }
  }, []);

  return (
    <div
      className="call-window"
      isOpen={currentAppointment.hasAppointmentStarted}
      ref={cardRef}>
      <div className="call-window-container">
        <span>
          <FaPhone className="mx-2" size="0.8em" />
          {`${currentAppointment.patientFirstName} ${currentAppointment.patientLastName}`}
        </span>
        <span>
          <FaAddressBook className="mx-2" size="0.8em" />
          {currentAppointment.phone}
        </span>
        <span className="dialog-body">
          {currentAppointment.isCallInProgress ? (
            <Button
              className="dial-btn-small"
              mr="12"
              color="danger"
              onClick={onHangup}
              disabled={isDisabled}>
              Hang Up
            </Button>
          ) : (
            <Button
              className="dial-btn-small"
              mr="12"
              color="secondary"
              disabled={isAppointmentEnded}
              onClick={() => {
                onCall(currentAppointment);
              }}>
              Redial
            </Button>
          )}

          {/* <Button
            className="dial-btn-small"
            mr="12"
            color="secondary"
            disabled={isAppointmentEnded}
            onClick={onExpand}>
            Take Notes
          </Button> */}

          <Button
            className="dial-btn-small"
            mr="12"
            color="primary"
            onClick={openDial}
            disabled={isDisabled}>
            Dialpad
          </Button>

          <Button
            className="dial-btn-small"
            color="danger"
            mr="12"
            onClick={handleEndAppointment}>
            End Appointment
          </Button>
        </span>
      </div>
    </div>
  );
};

Call.propTypes = {
  onHangup: PropTypes.func,
  isConnect: PropTypes.bool,
  isDisabled: PropTypes.bool,
  openDial: PropTypes.func,
  handleEndAppointment: PropTypes.func,
  onCall: PropTypes.func,
  hasAppointmentStarted: PropTypes.bool,
  currentAppointment: PropTypes.object,
  isAppointmentEnded: PropTypes.bool,
};

export { Call };
