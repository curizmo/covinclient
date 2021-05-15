import React from 'react';
import PropTypes from 'prop-types';

export const LikeIcon = ({
  width = '15',
  iconRef = null,
  transform = '',
  isActive = false,
}) => (
  <svg
    style={{ fill: isActive ? '#3d5a80' : '#000' }}
    ref={iconRef}
    viewBox="0 0 15 13"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    transform={transform}>
    <g id="Layer_1">
      <g>
        <path d="M0 13H2.72727V5.2H0V13ZM15 5.85C15 5.13175 14.3898 4.55 13.6364 4.55H9.33068L9.98182 1.5795C9.99545 1.5145 10.0057 1.44625 10.0057 1.37475C10.0057 1.105 9.88977 0.86125 9.70568 0.68575L8.97955 0L4.48977 4.28025C4.24432 4.5175 4.09091 4.8425 4.09091 5.2V11.7C4.09091 12.4182 4.70114 13 5.45455 13H11.5909C12.1568 13 12.6409 12.6718 12.8455 12.207L14.9011 7.6245C14.9625 7.475 15 7.31575 15 7.15V5.90525L14.9932 5.89875L15 5.85Z" />
      </g>
    </g>
  </svg>
);

LikeIcon.propTypes = {
  width: PropTypes.string,
  iconRef: PropTypes.object,
  transform: PropTypes.string,
  isActive: PropTypes.bool,
};
