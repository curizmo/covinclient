import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import DesktopPatientTable from 'components/DesktopPatientTable';
import { SearchInput } from 'components/common/SearchInput';
import { LinkButton } from 'components/common/Button';

import { routes } from 'routers';
import { isLightVersion } from 'config';
import excel from 'assets/images/svg-icons/excel.svg';
import xicon from 'assets/images/x-icon.png';

const TypeHeader = styled.h3`
  margin-bottom: 0;
  font-size: 1.25rem;
  line-height: 1.875rem;
  color: #1f3259;
`;

const DeskTopViewPatient = styled.section`
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 253px);
  }
  display: none;
`;

const InputContainer = styled.div`
  position: relative;
  min-width: 33%;
`;

const HeaderSearchWrap = styled.div`
  padding: 0 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NoPatientsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10rem;
  width: 100%;
  height: 100%;
  font-size: 1.1rem;
`;

// @toDo remove condition
const isShowNewButton = false;

const DesktopView = ({
  searchText,
  makeSearchRequest,
  selectedCases,
  searchRef,
  clearSearchInput,
  isDownloading,
  exportVitals,
  patients,
  isShowSpinner,
  incrementPage,
  hasNext,
  page,
}) => {
  return (
    <DeskTopViewPatient>
      <HeaderSearchWrap className="w-100 mb-3">
        {!isLightVersion && <TypeHeader>{selectedCases} Risk Cases</TypeHeader>}
        <InputContainer>
          <SearchInput
            customClass="w-100"
            searchText={searchText}
            requestSearch={makeSearchRequest}
            placeholder="Search by Name, Email or cellphone number"
            searchRef={searchRef}
            clearSearchInput={clearSearchInput}
          />
        </InputContainer>
        <div className="headsearch-btn-div">
          <Button
            className="btn btn-download mx-2"
            disabled={isDownloading}
            onClick={exportVitals}>
            {isDownloading ? (
              <span className="lds-spinner position-absolute">
                {[...Array(12).keys()].map((i) => (
                  <span key={i} />
                ))}
              </span>
            ) : (
              <>
                <span className="excel-image-wrap">
                  <img
                    src={excel}
                    alt="Covin"
                    className="logo download-excel-icon"
                  />
                  <img src={xicon} alt="Covin" className="logo x-icon" />
                </span>
                DOWNLOAD ALL (Xls)
              </>
            )}
          </Button>
          {isShowNewButton && (
            <LinkButton className="btn btn-covin" to={routes.addPatient.path}>
              + New Patient
            </LinkButton>
          )}
        </div>
      </HeaderSearchWrap>
      <DesktopPatientTable
        selectedCaseData={patients}
        isShowSpinner={isShowSpinner}
        incrementPage={incrementPage}
        hasNext={hasNext}
        page={page}
        selectedCases={selectedCases}
        searchText={searchText}
      />
      {patients?.length < 1 && searchText?.length > 0 && (
        <NoPatientsWrapper>
          <p>
            <strong>No results found</strong>
          </p>
          <Button onClick={clearSearchInput} className="link-button">
            Back to dashboard
          </Button>
        </NoPatientsWrapper>
      )}
    </DeskTopViewPatient>
  );
};

DesktopView.propTypes = {
  searchText: PropTypes.string,
  makeSearchRequest: PropTypes.func,
  selectedCases: PropTypes.array,
  searchRef: PropTypes.object,
  clearSearchInput: PropTypes.func,
  isDownloading: PropTypes.bool,
  exportVitals: PropTypes.func,
  patients: PropTypes.array,
  isShowSpinner: PropTypes.bool,
  incrementPage: PropTypes.array,
  hasNext: PropTypes.bool,
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { DesktopView };
