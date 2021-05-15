import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routers';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { LinkButton } from '../Button';

const AreYouAPhysicianButton = ({ isButton = false, ...buttonProps }) => {
  const { t } = useTranslation('common');
  const text = t('areYouAPractitioner');
  const props = { to: routes.physicianSignup.path };

  return isButton ? (
    <LinkButton {...props} {...buttonProps}>
      {text}
    </LinkButton>
  ) : (
    <Link {...props} {...buttonProps}>
      {text}
    </Link>
  );
};

AreYouAPhysicianButton.propTypes = {
  isButton: PropTypes.bool,
  buttonProps: PropTypes.object,
};

export { AreYouAPhysicianButton };
