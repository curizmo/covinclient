import React from 'react';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';

import { getIsShowSpinner } from '../../../selectors';
import { spinner } from '../../../constants';
import { SpinnerComponent } from './Spinner';

const spinnerRoot = document.getElementById(spinner.SPINNER_ROOT_ID);

const SpinnerPortal = () => {
  const isShowSpinner = useSelector(getIsShowSpinner);

  const spinnerJSX = isShowSpinner ? <SpinnerComponent /> : null;

  return createPortal(spinnerJSX, spinnerRoot);
};

export { SpinnerPortal };
