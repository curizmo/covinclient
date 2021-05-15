import React from 'react';
import * as PropTypes from 'prop-types';

import { Button } from '../Button';

import { StyleNextStep } from './style';

const NextStep = ({
  children,
  goToNextStep,
  goToPreviousStep,
  stepName,
  currentStep,
  nextButtonName,
}) => {
  if (currentStep === stepName) {
    return (
      <StyleNextStep>
        <div className="step-wrapper">{children}</div>
        <div className="buttons-wrapper">
          <Button onClick={goToPreviousStep} disabled={!goToPreviousStep}>
            Previous
          </Button>
          <Button onClick={goToNextStep} disabled={!goToNextStep}>
            {nextButtonName || 'Next'}
          </Button>
        </div>
      </StyleNextStep>
    );
  } else {
    return null;
  }
};

NextStep.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  goToNextStep: PropTypes.func,
  goToPreviousStep: PropTypes.func,
  stepName: PropTypes.string,
  currentStep: PropTypes.string,
  nextButtonName: PropTypes.string,
};

export { NextStep };
