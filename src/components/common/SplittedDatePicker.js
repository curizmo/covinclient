import React from 'react';
import { YearPicker, MonthPicker, DayPicker } from 'react-dropdown-date';

export const SplittedDatePicker = ({ date, setDate }) => {
  const setDatePart = (name) => (value) => {
    setDate((date) => ({ ...date, [name]: value }));
  };

  return (
    <div id="dropdown-date" className="form-group d-flex">
      <div id="dropdown-month" className="mr-2 flex-grow-1">
        <MonthPicker
          defaultValue={'Month'}
          short // default is full name
          year={date?.year} // mandatory
          value={date.month} // mandatory
          onChange={setDatePart('month')}
          id={'month'}
          name={'month'}
          classes="form-control"
        />
      </div>
      <div id="dropdown-day" className="mr-2 flex-grow-1">
        <DayPicker
          defaultValue={'Day'}
          year={date?.year} // mandatory
          month={date?.month} // mandatory
          value={date?.day} // mandatory
          onChange={setDatePart('day')}
          id={'day'}
          name={'day'}
          classes="form-control"
        />
      </div>
      <div id="dropdown-year" className="flex-grow-1">
        <YearPicker
          defaultValue={'Year'}
          value={date?.year} // mandatory
          onChange={setDatePart('year')}
          id={'year'}
          name={'year'}
          classes="form-control"
        />
      </div>
    </div>
  );
};
