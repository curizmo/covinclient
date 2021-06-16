import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import PatientCard from 'components/Dashboard/PatientCard';
import { SpinnerComponent } from 'components/common/SpinnerPortal/Spinner';
import { useSelector } from 'react-redux';
import { getSpinnerType } from 'selectors';
import { SPINNERS } from '../../constants';

const PatientsWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 335px);
    overflow: ${(props) => (props?.isInitLoading ? 'hidden' : 'scroll')};
  }
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

const MobileView = ({
  patients,
  clearSearchInput,
  hasNext,
  incrementPage,
  searchText,
}) => {
  const showSpinner = useSelector(getSpinnerType);

  return (
    <PatientsWrapper isInitLoading={showSpinner === SPINNERS.MAIN}>
      {patients?.length > 0
        ? patients?.map((patient) => (
            <PatientCard key={patient.patientId} patient={patient} />
          ))
        : showSpinner === SPINNERS.NONE &&
          searchText?.length > 0 && (
            <NoPatientsWrapper>
              <p>
                <strong>No results found</strong>
              </p>
              <Button onClick={clearSearchInput} className="link-button">
                Back to dashboard
              </Button>
            </NoPatientsWrapper>
          )}
      {showSpinner === SPINNERS.MAIN && (
        <SpinnerComponent isFullScreen={false} />
      )}
      {hasNext ? (
        <div className="load-more-container m-3">
          <Button
            onClick={incrementPage}
            disabled={showSpinner !== SPINNERS.NONE}
            className="btn-load-more btn btn-covin">
            {showSpinner === SPINNERS.MAIN ? (
              <div className="lds-spinner">
                {[...Array(12).keys()].map((i) => (
                  <span key={i} />
                ))}
              </div>
            ) : (
              <>Load More</>
            )}
          </Button>
        </div>
      ) : null}
    </PatientsWrapper>
  );
};

MobileView.propTypes = {
  patients: PropTypes.array,
  clearSearchInput: PropTypes.func,
  hasNext: PropTypes.bool,
  incrementPage: PropTypes.func,
  searchText: PropTypes.string,
};

export { MobileView };
