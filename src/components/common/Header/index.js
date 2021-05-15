import React from 'react';
import * as PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import SearchBar from '../SearchBar';
import { LanguageSelector } from '../LanguageSelector';

import { normalizeResults } from '../../../utils/normalizeResults';
import { routes } from '../../../routers';
import logo from '../../../assets/images/ask-covid-19-logo.svg';

const Header = ({
  contextRef,
  isLoading,
  results = [],
  searchTerm,
  handleResultSelect,
  handleSearchChange,
  handleKeyPress,
  addSuccess,
  messageActive,
  newQuestion,
  handleChangeLanguage,
}) => {
  const { t } = useTranslation('patientBoard');
  const newQuestionTitle = newQuestion ? newQuestion.title : '';

  return (
    <div context={contextRef.current} className="sticky-container">
      <div className="sticky-top">
        <Link to={routes.dashboard.path}>
          <img className="logo" src={logo} alt="Logo" />
        </Link>
        <div>
          <LanguageSelector handleChangeLanguage={handleChangeLanguage} />
          <SearchBar
            isLoading={isLoading}
            results={normalizeResults(results)}
            value={searchTerm}
            handleResultSelect={handleResultSelect}
            handleSearchChange={handleSearchChange}
            handleKeyPress={handleKeyPress}
          />
        </div>
        {addSuccess && messageActive && (
          <div className="message green">
            <div>{t('stickyHeader.questionSubmitted')}</div>
            <p>
              {t('stickyHeader.checkBackLater')} {newQuestionTitle}
            </p>
          </div>
        )}
        {!addSuccess && messageActive && (
          <div className="message red">
            <div>{t('stickyHeader.triedToSubmit')}</div>
            <p>{t('stickyHeader.somethingWentWrong')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  contextRef: PropTypes.object,
  isLoading: PropTypes.bool,
  results: PropTypes.array,
  searchTerm: PropTypes.string,
  handleResultSelect: PropTypes.func,
  handleSearchChange: PropTypes.func,
  handleKeyPress: PropTypes.func,
  addSuccess: PropTypes.bool,
  messageActive: PropTypes.bool,
  newQuestion: PropTypes.object,
  handleChangeLanguage: PropTypes.func,
};

export { Header };
