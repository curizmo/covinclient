import React from 'react';
import * as PropTypes from 'prop-types';

import { BannerMessage } from './BannerMessage';
import { useTranslation } from 'react-i18next';

const ErrorFallback = ({ error }) => {
  const { t } = useTranslation('common');

  return (
    <BannerMessage
      type="commonError"
      header={t('somethingWentWrong')}
      message={error.message}
    />
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

export { ErrorFallback };
