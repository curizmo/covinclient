import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerComponent = ({ isFullScreen = true, customClasses = '' }) => {
  return (
    <div
      className={`d-flex vw-100 t-0 l-0 spinner ${
        isFullScreen ? 'position-fixed vh-100' : 'position-absolute h-100'
      } ${customClasses}`}>
      <Spinner color="dark" className="m-auto" />
    </div>
  );
};

export { SpinnerComponent };
