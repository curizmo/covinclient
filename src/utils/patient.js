import * as patientService from 'services/patient';
import * as appointmentActions from 'actions/appointment';
import { APPOINTMENT_EVENT_STATUSES, CALL_METHODS } from '../constants';

export const handleCallAppointment = (dispatch, patientId) => async () => {
  try {
    const payload = {
      patientId,
    };

    const response = await patientService.createCallBooking(payload);
    const appointment = response.data.appointment;

    dispatch(
      appointmentActions.setAppointment({
        ...appointment,
        status: APPOINTMENT_EVENT_STATUSES.InProgress,
        callMethod: CALL_METHODS.TWILIO,
        isCallInProgress: false,
        hasCallEnded: false,
        hasAppointmentStarted: true,
      }),
    );
  } catch (err) {
    console.error(err);
  }
};
