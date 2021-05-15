import { useEffect, useState } from 'react';

import { RECCURENCE_TYPES, DAYS_INITIAL_VALUE } from '../../../constants';

const useCreateEditCalendarBlock = () => {
  const [state, setState] = useState({
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    reason: '',
    isRecurring: false,
    recurrenceType: '',
  });
  const [recurrenceTypeOptions, setRecurrenceTypeOptions] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [days, setDays] = useState(DAYS_INITIAL_VALUE);
  const [displayDays, setDisplayDays] = useState(false);

  useEffect(() => {
    const recurrenceTypeOptions = Object.keys(RECCURENCE_TYPES).map((key) => {
      return {
        label: RECCURENCE_TYPES[key],
        value: RECCURENCE_TYPES[key],
      };
    });

    setRecurrenceTypeOptions(recurrenceTypeOptions);
  }, []);

  const handleChange = (e) => {
    const newState = {
      ...state,
      [e.target.name]: e.target.value,
    };

    setState(newState);
    validateForm(newState, days);
  };

  const handleIsRecurringChange = (e) => {
    const isRecurring = e.target.checked;
    const newState = {
      ...state,
      isRecurring,
      recurrenceType: '',
    };
    setState(newState);
    setDays(DAYS_INITIAL_VALUE);
    setDisplayDays(false);
    validateForm(newState, DAYS_INITIAL_VALUE);
  };

  const handleRecurrenceTypeSelect = (e) => {
    const recurrenceType = e.target.value;
    const newState = {
      ...state,
      recurrenceType,
    };
    setState(newState);

    if (recurrenceType === RECCURENCE_TYPES.weekly) {
      setDisplayDays(true);
    } else {
      setDisplayDays(false);
      setDays(DAYS_INITIAL_VALUE);
    }

    validateForm(newState, days);
  };

  const handleDaySelect = (e) => {
    const newDays = {
      ...days,
      [e.target.name]: e.target.checked,
    };
    setDays(newDays);
    validateForm(state, newDays);
  };

  const validateForm = (state, days) => {
    const { startDate, startTime, endTime } = state;
    const isValid = startDate && startTime && endTime;

    if (!isValid) {
      setIsValid(isValid);

      return;
    }

    if (state.isRecurring && state.recurrenceType === RECCURENCE_TYPES.weekly) {
      const isValid = Object.keys(days)
        .map((key) => {
          return days[key];
        })
        .some((v) => v);

      setIsValid(isValid);

      return;
    }

    setIsValid(isValid);
  };

  const getSelectedDays = () => {
    let selectedDays = [];

    Object.keys(days).forEach((key) => {
      if (days[key]) {
        selectedDays = [...selectedDays, key];
      }
    });

    return selectedDays.join(',');
  };

  return {
    state,
    recurrenceTypeOptions,
    isValid,
    handleChange,
    handleIsRecurringChange,
    handleRecurrenceTypeSelect,
    setState,
    validateForm,
    handleDaySelect,
    displayDays,
    days,
    getSelectedDays,
    setDisplayDays,
    setDays,
  };
};

export { useCreateEditCalendarBlock };
