import React from 'react';
import debounce from 'lodash/debounce';
import { withTranslation } from 'react-i18next';
import { Input } from 'reactstrap';

const SearchBar = (props) => {
  const { t } = props;

  return (
    <div className="search-container mb-3">
      <Input
        type="search"
        onChange={debounce(props.handleSearchChange, 500, {
          leading: true,
        })}
        results={props.results}
        value={props.value}
        placeholder={t('patientBoard:searchBar.haveAQuestion')}
        onKeyPress={props.handleKeyPress}
      />
      {props.value && props.results && props.results.length ? (
        <div className="search-results shadow-sm">
          {props.results.map((result) => {
            return (
              <div
                className="small p-2 border-bottom cursor-pointer bg-light"
                key={result.id}
                onClick={() => {
                  props.handleResultSelect(result);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    props.handleResultSelect(result);
                  }
                }}
                role="button"
                tabIndex={0}>
                {result.title}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default withTranslation()(SearchBar);
