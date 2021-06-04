import { Device } from 'twilio-client';
import { useSelector, useDispatch } from 'react-redux';

import { createTwilioToken } from '../services/twilio';
import {
  getTwilioDevice,
  getTwilioConnection,
  getAppointment,
} from 'selectors';

import * as twilioActions from 'actions/twilio';
import * as appointmentActions from '../actions/appointment';

const useTwilio = () => {
  const device = useSelector(getTwilioDevice);
  const currentAppointment = useSelector(getAppointment);
  const connection = useSelector(getTwilioConnection);

  const dispatch = useDispatch();

  const onDigitDialed = (digit) => {
    connection.sendDigits(digit);
  };

  const setupDevice = async (phoneNumber) => {
    const response = await createTwilioToken();
    const token = response.data.twilioToken;
    const device = new Device(token, {
      codecPreferences: ['opus', 'pcmu'],
      fakeLocalDTMF: true,
      enableRingingState: false,
    });
    device.on('ready', function (device) {
      dispatch(twilioActions.setTwilioDevice(device));
      callCustomer(phoneNumber, device);
    });

    device.on('error', function (error) {
      console.log('Twilio.Device Error: ', error);
    });

    device.on('connect', function (conn) {
      if ('phoneNumber' in conn.message) {
        console.log('In call with ' + conn.message.phoneNumber);
      } else {
        // This is a call from a website user to a support agent
        console.log('In call with support');
      }
    });

    device.on('disconnect', function (conn) {
      device.destroy();
      conn.disconnect();
    });
  };
  function callCustomer(phoneNumber, device) {
    const params = { phoneNumber: phoneNumber };
    const connection = device.connect(params);
    dispatch(twilioActions.setTwilioConnection(connection));

    connection.on('accept', function () {
      console.log('the call has been accepted');
      dispatch(
        appointmentActions.setAppointment({
          ...currentAppointment,
          isCallInProgress: true,
          hasCallEnded: false,
          hasAppointmentStarted: true,
        }),
      );
    });

    connection.on('cancel', function () {
      hangUp(device);
    });

    connection.on('disconnect', function () {
      hangUp(device);
      dispatch(
        appointmentActions.setAppointment({
          ...currentAppointment,
          isCallInProgress: false,
          hasCallEnded: true,
          hasAppointmentStarted: false,
        }),
      );
      dispatch(twilioActions.resetTwilio());
    });

    connection.on('reject', function () {
      hangUp(device);
    });

    connection.on('ringing', function () {
      console.log('the call is ringing');
    });

    connection.on('error', function () {
      console.log('error detected');
    });
  }

  function hangUp(device) {
    if (device && device.disconnectAll) {
      device.disconnectAll();
      device.destroy();
    }

    dispatch(twilioActions.resetTwilio());
  }

  return {
    setupDevice,
    hangUp,
    device,
    onDigitDialed,
    connection,
  };
};

export { useTwilio };
