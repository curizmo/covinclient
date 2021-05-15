import { APPOINTMENT_EVENT_STATUSES } from '../constants';

/**
 * Function to sort apointments by status and event start time.
 *
 * This function sorts appointments which have checked in status to the top.
 * It also then sorts the checked in appointments by the start time.
 *
 * @param {array} appointments
 */
export const sortByStatusAndTime = (appointments) => {
  let bookings = [...appointments];

  bookings.sort((a, b) => {
    if (
      a.eventStatusDesc === APPOINTMENT_EVENT_STATUSES.CheckedIn &&
      b.eventStatusDesc !== APPOINTMENT_EVENT_STATUSES.CheckedIn
    ) {
      return -1;
    }

    if (
      a.eventStatusDesc !== APPOINTMENT_EVENT_STATUSES.CheckedIn &&
      b.eventStatusDesc === APPOINTMENT_EVENT_STATUSES.CheckedIn
    ) {
      return 1;
    }

    return (
      new Date(a.eventStartTime).getTime() -
      new Date(b.eventStartTime).getTime()
    );
  });

  return bookings;
};
