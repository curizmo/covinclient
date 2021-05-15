import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import { Call } from './Call';
import { Dial } from './Dial';
import { routes } from 'routers';
import { getAppointment, getTwilioDevice, getUser } from 'selectors';

import { useTwilio } from 'hooks/useTwilio';

import { CALL_METHODS } from 'constants/index';

import * as appointmentActions from 'actions/appointment';
import * as appointmentService from 'services/appointment';

function CallDialog() {
  const currentAppointment = useSelector(getAppointment);

  let location = useLocation();
  const device = useSelector(getTwilioDevice);
  const dispatch = useDispatch();
  const { hangUp, onDigitDialed, setupDevice } = useTwilio();
  const [openDial, setOpenDial] = useState(false);
  const [isAppointmentEnded, setIsAppointmentEnded] = useState(false);

  const user = useSelector(getUser);
  const history = useHistory();

  const isDisabled =
    Object.keys(device).length === 0 || currentAppointment.hasCallEnded;

  const onCall = (currentAppointment) => {
    setupDevice(currentAppointment.phone);

    dispatch(
      appointmentActions.setAppointment({
        ...currentAppointment,
        isCallInProgress: true,
        hasCallEnded: false,
        hasAppointmentStarted: true,
      }),
    );
  };

  const onHangup = () => {
    hangUp(device);
    setOpenDial(false);
    dispatch(
      appointmentActions.setAppointment({
        ...currentAppointment,
        isCallInProgress: false,
        hasCallEnded: true,
      }),
    );
  };

  const onExpand = () => {
    history.push(routes.teleHealth.path, {
      appointment: {
        ...currentAppointment,
        hasAppointmentStarted: true,
      },
    });
  };

  const handleEndAppointment = async () => {
    try {
      if (
        currentAppointment.isCallInProgress &&
        currentAppointment.callMethod === CALL_METHODS.TWILIO
      ) {
        onHangup();
      }
      setIsAppointmentEnded(true);
      await appointmentService.endAppointment({
        user,
        appointment: {
          ...currentAppointment,
          hasAppointmentStarted: false,
          hasCallEnded: true,
          isCallInProgress: false,
        },
      });

      dispatch(
        appointmentActions.setAppointment({
          ...currentAppointment,
          hasAppointmentStarted: false,
          hasCallEnded: true,
          isCallInProgress: false,
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDialOpen = () => {
    return setOpenDial(!openDial);
  };

  return (
    <>
      {currentAppointment &&
      currentAppointment.hasAppointmentStarted &&
      location.pathname !== routes.teleHealth.path ? (
        <div>
          <Call
            onHangup={onHangup}
            onExpand={onExpand}
            openDial={handleDialOpen}
            handleEndAppointment={handleEndAppointment}
            isDisabled={isDisabled}
            onCall={onCall}
            currentAppointment={currentAppointment}
            isAppointmentEnded={isAppointmentEnded}
          />
          {openDial && <Dial onDigitDialed={onDigitDialed} />}
        </div>
      ) : null}
    </>
  );
}

export default CallDialog;
