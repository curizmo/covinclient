import React, { useState, useEffect, useCallback } from 'react';
import * as PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { whitelist, languages, fallbackLng } from '../../../config/languages';
import { getLanguage } from '../../../utils';
// @todo use tailwind for style
import './style.css';

const LanguageSelector = ({ handleChangeLanguage, className = '' }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(getLanguage() || fallbackLng);

  const switchLanguage = (event) => {
    setLanguage(event.target.value);
  };
  const changeLanguage = useCallback(async () => {
    if (language) {
      await i18n.changeLanguage(language);
      if (handleChangeLanguage) {
        handleChangeLanguage(languages[language]);
      }
    }
  }, [i18n, language, handleChangeLanguage]);

  useEffect(() => {
    changeLanguage();
  }, [changeLanguage]);

  return (
    <div className="language-selector">
      {/* jsx-a11y/no-onchange */}
      <select
        className={className}
        value={language}
        onChange={switchLanguage}
        onBlur={switchLanguage}>
        {whitelist.map((key) => (
          <option key={key} value={key}>
            {languages[key]}
          </option>
        ))}
      </select>
    </div>
  );
};

LanguageSelector.propTypes = {
  handleChangeLanguage: PropTypes.func,
  className: PropTypes.string,
};

export { LanguageSelector };
