import React from 'react';
import { Spinner } from 'reactstrap';

const SpinnerComponent = () => {
  return (
    <div className="d-flex vw-100 vh-100 position-fixed t-0 l-0 spinner">
      <Spinner color="dark" className="m-auto" />
    </div>
  );
};

export { SpinnerComponent };
