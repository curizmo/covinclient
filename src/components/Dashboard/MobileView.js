import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import PatientCard from 'components/Dashboard/PatientCard';
import { SpinnerComponent } from 'components/common/SpinnerPortal/Spinner';

const PatientsWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 450px);
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
  isInitLoading,
  patients,
  searchText,
  clearSearchInput,
  hasNext,
  incrementPage,
  isShowSearchSpinner,
}) => {
  return (
    <PatientsWrapper isInitLoading={isInitLoading}>
      {patients?.length > 0
        ? patients?.map((patient) => (
            <PatientCard key={patient.patientId} patient={patient} />
          ))
        : searchText?.length > 0 && (
            <NoPatientsWrapper>
              <p>
                <strong>No results found</strong>
              </p>
              <Button onClick={clearSearchInput} className="link-button">
                Back to dashboard
              </Button>
            </NoPatientsWrapper>
          )}
      {isInitLoading && <SpinnerComponent isFullScreen={false} />}
      {hasNext ? (
        <div className="load-more-container m-3">
          <Button
            onClick={incrementPage}
            disabled={isInitLoading || isShowSearchSpinner}
            className="btn-load-more btn btn-covin">
            {isInitLoading || isShowSearchSpinner ? (
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

export { MobileView };
