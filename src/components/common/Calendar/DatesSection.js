import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import { SCHEDULE_STATUS } from '../../../constants';

const DatesSection = ({ dates, onDateSelect, defaultValue }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const onSelect = (date) => () => {
    onDateSelect(date);
    setSelectedDate(date);
  };

  useEffect(() => {
    setSelectedDate(defaultValue);
  }, [defaultValue]);

  return (
    <div className="d-flex justify-content-between overflow-auto flex-grow-1">
      {dates && dates.length > 0
        ? dates.map((dateToShow, index) => {
            const isSelected = selectedDate === dateToShow.eventDate;
            return (
              <Button
                color={isSelected ? 'primary' : 'light'}
                className="border-0 p-2 p-md-3 mx-1 flex-even"
                key={dateToShow.eventDate + index}
                value={dateToShow.eventDate}
                disabled={
                  dateToShow.scheduleStatus === SCHEDULE_STATUS.UNAVAILABLE
                }
                onClick={onSelect(dateToShow.eventDate)}>
                <div className="pointer-events-none">
                  <p>
                    <b>{dateToShow.weekDay}</b>
                  </p>
                  <p className="mb-0">{dateToShow.eventDate}</p>
                </div>
              </Button>
            );
          })
        : null}
    </div>
  );
};

DatesSection.propTypes = {
  onDateSelect: PropTypes.func,
  dates: PropTypes.arrayOf(PropTypes.object),
  defaultValue: PropTypes.string,
};

export { DatesSection };
