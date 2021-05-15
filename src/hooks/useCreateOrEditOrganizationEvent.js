import { useState } from 'react';
import { useDispatch } from 'react-redux';

const useCreateEditOrganizationEvent = () => {
  const [organizationEvent, setOrganizationEvent] = useState({
    eventName: '',
    organization: '',
    isGroupEvent: false,
    activeFrom: '',
    activeTo: '',
    maxCount: 0,
    buffer: 0,
    duration: 1,
    autoConfirm: true,
    isMultipleSession: false,
    sessionCount: 0,
    days: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false,
    },
    futureRollingDays: '',
    startTime: '',
    endTime: '',
    eventFee: 0,
    currencyCode: 'USD',
    timezone: 'PST',
  });
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const newOrganizationeEvent = {
      ...organizationEvent,
      [e.target.name]: e.target.value,
    };

    setOrganizationEvent(newOrganizationeEvent);
    validateForm(newOrganizationeEvent);
  };

  const handleEventTypeSelect = (e) => {
    const newOrganizationeEvent = {
      ...organizationEvent,
      isGroupEvent: e.target.value === 'groupVisit',
      maxCount: e.target.value === 'groupVisit' ? 2 : 0,
    };

    setOrganizationEvent(newOrganizationeEvent);
    validateForm(newOrganizationeEvent);
  };

  const handleBookingTypeSelect = (e) => {
    const newOrganizationeEvent = {
      ...organizationEvent,
      isMultipleSession: e.target.value === 'multipleSession',
      sessionCount: e.target.value === 'multipleSession' ? 2 : 0,
    };

    validateForm(newOrganizationeEvent);
    setOrganizationEvent(newOrganizationeEvent);
  };

  const handleAutoConfirmChange = (e) => {
    const newOrganizationeEvent = {
      ...organizationEvent,
      autoConfirm: e.target.checked,
    };

    setOrganizationEvent(newOrganizationeEvent);
  };

  const handleDaySelect = (e) => {
    const newOrganizationeEvent = {
      ...organizationEvent,
      days: {
        ...organizationEvent.days,
        [e.target.name]: e.target.checked,
      },
    };

    setOrganizationEvent(newOrganizationeEvent);
    validateForm(newOrganizationeEvent);
  };

  const validateForm = (organizationEvent) => {
    const {
      eventName,
      organization,
      isGroupEvent,
      maxCount,
      activeFrom,
      buffer,
      duration,
      isMultipleSession,
      sessionCount,
      days,
      startTime,
      endTime,
      futureRollingDays,
      eventFee,
      currencyCode,
      timezone,
    } = organizationEvent;
    let isValid = !!(
      eventName &&
      organization &&
      activeFrom &&
      buffer >= 0 &&
      duration >= 1 &&
      days &&
      startTime &&
      endTime &&
      futureRollingDays &&
      (eventFee !== null || eventFee !== undefined) &&
      currencyCode &&
      timezone
    );

    if (!isValid) {
      setIsValid(false);

      return;
    }

    isValid = isGroupEvent && maxCount < 2 ? false : true;

    if (!isValid) {
      setIsValid(false);

      return;
    }

    isValid = isMultipleSession && sessionCount < 2 ? false : true;

    if (!isValid) {
      setIsValid(false);

      return;
    }

    isValid = Object.keys(days).some((key) => days[key]);

    setIsValid(isValid);
  };

  return {
    organizationEvent,
    isValid,
    dispatch,
    handleChange,
    handleAutoConfirmChange,
    handleBookingTypeSelect,
    handleDaySelect,
    handleEventTypeSelect,
    setOrganizationEvent,
    validateForm,
  };
};

export { useCreateEditOrganizationEvent };
