import React from 'react';

export const StatusIndicator = ({ status = '', size = 16 }) => {
  return (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <span
        className={`status-indicator bg-${status?.toLowerCase()}-risk size-${size}`}
      />
    </div>
  );
};
