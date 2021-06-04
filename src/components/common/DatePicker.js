import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import * as PropTypes from 'prop-types';

import calendarIcon from 'assets/images/svg-icons/calendar.svg';

const DatePickerWrapper = styled.div`
  position: relative;
`;
const DatePickerIcon = styled.img`
  pointer-events: none;
  position: absolute;
  right: 12px;
  top: 0;
  transform: translate3d(0, 50%, 0);
  background: #fff;
`;

export const DatePicker = ({
  onSelect,
  customClass = '',
  format = 'DD/MM/YYYY',
  defaultDate = new Date(),
  maxDate = new Date(),
  showMonthAfterYear = false,
  defaultValue = '',
}) => {
  const pikadayRef = useRef(null);

  useEffect(() => {
    new Pikaday({
      field: pikadayRef.current,
      format,
      onSelect,
      defaultDate,
      showMonthAfterYear,
      maxDate,
    });
  }, []);

  return (
    <DatePickerWrapper className={customClass}>
      <input
        type="text"
        ref={pikadayRef}
        placeholder={format.toLowerCase()}
        className="form-control"
        value={defaultValue}
      />
      <DatePickerIcon src={calendarIcon} alt="calendar" />
    </DatePickerWrapper>
  );
};

DatePicker.propTypes = {
  onSelect: PropTypes.func,
  customClass: PropTypes.string,
  format: PropTypes.string,
  defaultDate: PropTypes.object,
  defaultValue: PropTypes.string,
  showMonthAfterYear: PropTypes.bool,
  maxDate: PropTypes.object,
};
