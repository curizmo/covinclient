import React, { useState, useMemo, useEffect } from 'react';
import * as PropTypes from 'prop-types';

import { ArrowButton } from '../Button';
import { DatesSection } from './DatesSection';

import {
  DAYS_IN_WEEK,
  DIRECTION,
  MONTHS,
  SCHEDULE_STATUS,
} from '../../../constants';

const Calendar = ({
  dates,
  showDates = DAYS_IN_WEEK,
  onDateSelect,
  value,
  datesKeys,
}) => {
  const { datesKeysLength, startDate, endDate } = useMemo(() => {
    const datesKeysLength = datesKeys.length;
    const startDate = datesKeys[0];
    const endDate = datesKeys[datesKeysLength - 1];
    return { datesKeysLength, startDate, endDate };
  }, [datesKeys]);

  const [selectedDate, setSelectedDate] = useState('');
  const [daysShift, setDaysShift] = useState(1);
  const [datesToShow, setDatesToShow] = useState([{ date: startDate }]);

  const isNextWeekDisabled = useMemo(() => {
    const shiftedDate = new Date(datesToShow[0].eventDate);
    shiftedDate.setDate(shiftedDate.getDate() + DAYS_IN_WEEK);

    return shiftedDate > new Date(endDate);
  }, [datesToShow]);

  const firstDateToShow = useMemo(() => {
    return new Date(datesToShow[0].eventDate);
  }, [datesToShow]);

  const onChange = (date) => {
    onDateSelect(date);
    setSelectedDate(date);
  };

  const incrementWeek = () => {
    setDaysShift(daysShift + DAYS_IN_WEEK);
  };

  const decrementWeek = () => {
    setDaysShift(daysShift - DAYS_IN_WEEK);
  };

  useEffect(() => {
    const datesArray = [];
    const shiftedDateIndex = daysShift - 1;
    if (datesKeysLength > 0) {
      for (
        let i = shiftedDateIndex;
        i < shiftedDateIndex + showDates && i < datesKeysLength;
        i++
      ) {
        const scheduleStatus = dates[datesKeys[i]]?.some(
          (date) => date.scheduleStatus === SCHEDULE_STATUS.AVAILABLE,
        )
          ? SCHEDULE_STATUS.AVAILABLE
          : SCHEDULE_STATUS.UNAVAILABLE;
        datesArray.push({
          ...dates[datesKeys[i]][0],
          scheduleStatus,
        });
      }
    }
    setDatesToShow(datesArray);
  }, [daysShift, datesKeysLength, dates, showDates]);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  return (
    <div className="w-100">
      <div className="d-flex justify-content-end rounded bg-white px-3 py-4">
        <p className="my-auto">
          {MONTHS[firstDateToShow.getMonth()]}, {firstDateToShow.getFullYear()}
        </p>
      </div>
      <div className="d-flex rounded bg-white px-2 px-md-3 py-3 py-md-4">
        <ArrowButton
          onClick={decrementWeek}
          disabled={daysShift <= 1}
          color="light"
          className="mr-1 mr-md-2 p-2 p-md-3"
        />
        <DatesSection
          dates={datesToShow}
          onDateSelect={onChange}
          defaultValue={selectedDate}
        />
        <ArrowButton
          direction={DIRECTION.right}
          onClick={incrementWeek}
          disabled={isNextWeekDisabled}
          color="light"
          className="ml-1 ml-md-2 p-2 p-md-3"
        />
      </div>
    </div>
  );
};

Calendar.propTypes = {
  showDates: PropTypes.number,
  dates: PropTypes.object,
  onDateSelect: PropTypes.func,
  value: PropTypes.string,
  datesKeys: PropTypes.array,
};

export { Calendar };
