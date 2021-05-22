import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import {
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_SECOND,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
  MILLISECONDS_IN_DAY,
  SCHEDULE_STATUS,
  TIME_ZONE_DATABASE_NAME,
} from '../constants';

/**
 * @param {number} minutes
 * @return {number}
 */
const getMillisecondsInMinutes = (minutes) => minutes * MILLISECONDS_IN_MINUTE;

/**
 * @param {number} dateShift
 * @return {Date}
 */
export const getMaxDate = (dateShift) => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + dateShift);
  return maxDate;
};

/**
 * @param {string} dateTimePart
 * @return {string} - examples: 0 -> 00, 9 -> 09, 10 -> 10
 */
export const getTwoDigitsPart = (dateTimePart) => {
  if (dateTimePart < 0) {
    return '00';
  }
  const normalizedPart = parseInt(dateTimePart).toString();
  return normalizedPart.length > 1 ? normalizedPart : `0${normalizedPart}`;
};

/**
 * @param {number|Date} time
 * @param {boolean} isShowSeconds
 * @return {string} - example: 10:01
 */
export const getTimeString = (time, isShowSeconds = false) => {
  const dateTime = new Date(time);
  const hours = dateTime.getHours().toString();
  const minutes = dateTime.getMinutes().toString();
  return `${getTwoDigitsPart(hours)}:${getTwoDigitsPart(minutes)}${
    isShowSeconds ? ':00' : ''
  }`;
};

/**
 * @param {Date} startTime
 * @param {number} shiftInMinutes
 * @return {Date}
 */
const getTimeWithShift = (startTime, shiftInMinutes) => {
  const shiftedTime = new Date(startTime);
  shiftedTime.setTime(
    shiftedTime.getTime() + getMillisecondsInMinutes(shiftInMinutes),
  );
  return shiftedTime;
};

/**
 * @param {Date} date
 * @param {Date} time
 * @return {Date}
 */
const getDateTime = (date, time) => {
  const timeArray = time.split(':');
  const dateTime = new Date(date).setHours(
    timeArray[0],
    timeArray[1],
    timeArray[2],
  );
  return new Date(dateTime);
};

/**
 * @typedef {object} DateTimeSlot
 * @property {Date} eventStartTime
 * @property {Date} eventEndTime
 */

/**
 * @param {Date} date
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {number} duration
 * @param {number} buffer
 * @return {DateTimeSlot[]}
 */
// @toDo remove generateTimeSlots as this should be done on BE
export const generateTimeSlots = (
  date,
  startTime,
  endTime,
  duration,
  buffer,
) => {
  const startDateTime = getDateTime(date, startTime);
  const endDateTime = getDateTime(date, endTime);
  let time = startDateTime;
  const dateTimeSlots = [];
  while (time < endDateTime) {
    const eventEndTime = getTimeWithShift(time, duration);
    const dateTimeSlot = {
      eventStartTime: time,
      eventEndTime,
    };
    if (eventEndTime < endDateTime) {
      dateTimeSlots.push(dateTimeSlot);
    } else {
      break;
    }
    time = getTimeWithShift(eventEndTime, buffer);
  }

  // @todo remove, added for demo purposes, adds appointment in 5 minutes
  const eventStartTime = getTimeWithShift(new Date(), 5);
  const eventEndTime = getTimeWithShift(eventStartTime, 15);
  const dateTimeSlot = {
    eventStartTime,
    eventEndTime,
  };
  dateTimeSlots.push(dateTimeSlot);

  return dateTimeSlots;
};

/**
 *
 * @param {Date} appointmentDate
 * @param {string} format
 * @return {String}
 */
export const getAppointmentDate = (appointmentDate, format = 'dd-mm-yyyy') => {
  const date = new Date(appointmentDate);
  const dd = getTwoDigitsPart(date.getDate());
  const mm = getTwoDigitsPart(date.getMonth() + 1);
  const yyyy = date.getFullYear();

  switch (format) {
    case 'dd/mm/yyyy':
      return `${dd}/${mm}/${yyyy}`;
    case 'dd-mm-yyyy':
      return `${dd}-${mm}-${yyyy}`;
    case 'yyyy-mm-dd':
      return `${yyyy}-${mm}-${dd}`;
    default:
      return '';
  }
};

/**
 * @param {Date} date
 * @return {string} - example: 2020-06-17
 */
export const getDateWithTimezoneOffset = (date) => {
  const dateWithOffset = new Date(date);
  // const timeZoneOffset = dateWithOffset.getTimezoneOffset();
  // dateWithOffset.setHours(dateWithOffset.getHours() + timeZoneOffset / 60);
  // dateWithOffset.setMinutes(dateWithOffset.getMinutes() + (timeZoneOffset % 60));
  return dateWithOffset;
};

/**
 * @param {Date} date
 * @return {string} - example: 2020-06-17
 */
export const getISODate = (date) => {
  return getAppointmentDate(date, 'yyyy-mm-dd');
};

/**
 * @param {Date} date
 * @return {string} - example: 06/17/2020
 */
export const getFormatedDate = (date) => {
  return getAppointmentDate(date, 'dd/mm/yyyy');
};

/**
 *
 * @param {Date} appointmentDate
 * @returns {String}
 */

export const getAppointmentTime = (appointmentDate) => {
  const date = new Date(appointmentDate);

  return `${getTwoDigitsPart(date.getHours())}:${getTwoDigitsPart(
    date.getMinutes(),
  )}`;
};

/**
 *
 * @param {Date} date
 * @returns {String}
 */
export const getAppointmentDateTime = (date) => {
  return `${getAppointmentDate(date, 'yyyy-mm-dd')}T${getAppointmentTime(
    date,
    true,
  )}`;
};

/**
 * @param {DateTimeSlot[]} timeSlots
 * @return {{name: string, value: string}}}
 */
export const getTimeSlotsList = (timeSlots) =>
  timeSlots.map((time) => ({
    name: `${time.eventStartTime} - ${time.eventEndTime}`,
    value: JSON.stringify({
      eventStartTime: `${time.eventDate}T${time.eventStartTime}`,
      eventEndTime: `${time.eventDate}T${time.eventEndTime}`,
    }),
    disabled: time.scheduleStatus !== SCHEDULE_STATUS.AVAILABLE,
  }));

/**
 *
 * @param {number} count
 * @param {function} callback
 * @returns {function}
 */
export const changeTimeCounter = (count, callback) => {
  return () => {
    count > 0 && callback(count - 1);
  };
};
/**
 * @returns {currentDate}
 */
export const currentDate = () => new Date();

/**
 *
 * @param {string} date
 * @returns {boolean}
 */
export const isToday = (dateString) => {
  const today = currentDate();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 *
 * @param {Date} appointmentTime
 * @returns {boolean}
 */
export const getSecondsLeft = (startTime) => {
  return (
    (startTime.getTime() - currentDate().getTime()) / MILLISECONDS_IN_SECOND
  );
};

/**
 *
 * @param {Date} appointmentTime
 * @param {number} hours
 * @returns {boolean}
 */
export const isLessThanHours = (startTime, hours) => {
  const hoursLeft = getSecondsLeft(startTime) / SECONDS_IN_HOUR;
  return hoursLeft < hours;
};

/**
 *
 * @param {Date} appointmentTime
 * @returns {boolean}
 */
export const isOutDated = (startTime) => {
  const hoursLeft = getSecondsLeft(startTime);
  return hoursLeft < 0;
};

/**
 *
 * @param {Date} time
 * @returns {string}
 */
export const getTimeIn12HourClockFormat = (time) => {
  const timeString = getTimeString(time);
  const hours = timeString.slice(0, 2);

  const format = Number(hours) < 12 ? 'A.M.' : 'P.M.';
  return `${timeString}  ${format}`;
};

/**
 *
 * @param {number} timeInSeconds
 * @returns {string}
 */
export const getCounterString = (timeInSeconds) => {
  const seconds = getTwoDigitsPart(timeInSeconds % SECONDS_IN_MINUTE);
  const minutes = getTwoDigitsPart(timeInSeconds / SECONDS_IN_MINUTE);

  return `${minutes}:${seconds}`;
};

/**
 *
 * @param {number} day1
 * @param {number} day2
 * @returns {number}
 */
export const getDaysDifference = (day1, day2) => {
  return (day2 - day1) / MILLISECONDS_IN_DAY;
};

/**
 * Returns time string "2020-10-29" from "2020-10-29T12:00:00".
 *
 * @param {string} dateTime
 *
 * @returns {string}
 */
export const getTodayStartString = (dateTime) => {
  return `${dateTime.split(/T/)[0]}T00:00:00`;
};

/**
 * Format date the following format:
 *
 *  Wednesday January 24 at 3:30 PM (PST)
 */
export const getReadableDate = (date) => {
  const pstDate = utcToZonedTime(new Date(date), TIME_ZONE_DATABASE_NAME);
  const readableDate = format(new Date(pstDate), "PPPP 'at' hh:mm b '(PST)'");

  return readableDate;
};

/**
 * Format date the following format:
 *
 *  January 24, 2021
 */
export const getReadableAppointmentDate = (date) => {
  const pstDate = utcToZonedTime(new Date(date), TIME_ZONE_DATABASE_NAME);
  const readableDate = format(new Date(pstDate), 'PPP');

  return readableDate;
};

/**
 * Get today's date at the start of a day.
 */
export const getStartOfDayToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return new Date(date);
};

/**
 * @param {Date} date
 * @return {string} - example: 10:22am on 22 May 2021
 */
export const getFormatedTimeDate = (date) => {
  const dateObject = date ? new Date(date) : new Date();
  return dateObject.toLocaleString();
};
