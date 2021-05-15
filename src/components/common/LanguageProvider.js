import React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import i18nConfig from '../../i18n';

/**
 * @param {JSXElement} children
 * @returns {JSXElement}
 */
const LanguageProvider = ({ children }) => {
  const { ready } = useTranslation();

  return (
    <I18nextProvider i18n={i18nConfig}>
      {
        ready ? children : null // @todo add spinner for empty page until translations are loaded
      }
    </I18nextProvider>
  );
};

export { LanguageProvider };
