import React from 'react';
import * as PropTypes from 'prop-types';

export const InfoItem = ({ label, value }) => {
  return (
    <div className="info-item mr-2 px-1 flex-column">
      <p className="info-label">{label}</p>
      <p className="info-value">{value}</p>
    </div>
  );
};

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
