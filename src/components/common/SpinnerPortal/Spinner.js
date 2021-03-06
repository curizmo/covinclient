import React from 'react';
import { Spinner } from 'reactstrap';
import PropTypes from 'prop-types';

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

const DotFlashingSpinner = ({ customClasses = '', isShow }) => {
  return (
    <div className={`dot-flashing-wrapper ${customClasses}`}>
      <div className="snippet" data-title=".dot-flashing">
        <div className="stage">
          {isShow && <div className="dot-flashing"></div>}
        </div>
      </div>
    </div>
  );
};

SpinnerComponent.propTypes = {
  isFullScreen: PropTypes.bool,
  customClasses: PropTypes.string,
};

DotFlashingSpinner.propTypes = {
  isShow: PropTypes.bool,
  customClasses: PropTypes.string,
};

export { SpinnerComponent, DotFlashingSpinner };
