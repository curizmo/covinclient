import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerComponent = ({ isFullScreen = true }) => {
  return (
    <div
      className={`d-flex vw-100 t-0 l-0 spinner ${
        isFullScreen ? 'vh-100 position-fixed' : 'h-100 position-absolute'
      }`}>
      <Spinner color="dark" className="m-auto" />
    </div>
  );
};

export { SpinnerComponent };
