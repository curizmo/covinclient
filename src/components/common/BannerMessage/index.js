import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Alert } from 'reactstrap';

import { getIsShowSpinner } from '../../../selectors';
import { bannerTypes } from '../../../constants';

const getBannerColor = (type) => {
  switch (type) {
    case 'error':
      return 'danger';
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
    default:
      return '';
  }
};

const BannerMessage = ({
  type = 'default',
  header,
  message,
  close = () => {},
}) => {
  const isShowSpinner = useSelector(getIsShowSpinner);
  const className = isShowSpinner ? 'blur-content' : '';
  const bannerContent = (
    <>
      <p className="font-weight-bold mb-1">{header}</p>
      {message}
    </>
  );

  if (type === bannerTypes.commonError) {
    return (
      <Alert color="danger" role="alert" className={className}>
        {bannerContent}
      </Alert>
    );
  } else {
    return (
      <Alert
        color={getBannerColor(type)}
        className={`fixed-top rounded-0 ${className}`}
        toggle={close}>
        {bannerContent}
      </Alert>
    );
  }
};

BannerMessage.propTypes = {
  type: PropTypes.oneOf(Object.keys(bannerTypes)),
  header: PropTypes.string,
  message: PropTypes.string,
  close: PropTypes.func,
};

export { BannerMessage };
