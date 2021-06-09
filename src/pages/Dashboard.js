import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import PatientCard from 'components/Dashboard/PatientCard';
import DesktopPatientTable from 'components/DesktopPatientTable';
import CasesCardComponent from 'components/CasesCard';
import { DashboardLayout } from 'components/common/Layout';
import { SearchInput } from 'components/common/SearchInput';
import { SpinnerComponent } from 'components/common/SpinnerPortal/Spinner';
import { LinkButton } from 'components/common/Button';

import { exportToCSV } from 'utils/vitalsDownload';

import time from 'assets/images/svg-icons/clock.svg';
import excel from 'assets/images/svg-icons/excel.svg';
import xicon from 'assets/images/x-icon.png';

import { getDate, setDate, setDateTime } from '../global';

import {
  DateAndTime,
  DateAndTimeWrap,
  InfoWrapper,
  TimeImage,
  ViewName,
} from '../global/styles';

import {
  getSearchResult,
  getSearchText,
  getUser,
  getIsShowSearchSpinner,
  getPatientsHasNext,
} from 'selectors';

import { usePatientsRiskData } from '../services/practitioner';
import * as patientVitalsService from 'services/patientVitals';

import { isLightVersion } from '../config';

import { RISK, VitalsDateFields } from '../constants';
import { CAMEL_CASE_REGEX } from '../constants/regex';

import { routes } from 'routers';

import { clearSearch, requestSearch } from 'actions/search';

import useCheckIsMobile from 'hooks/useCheckIsMobile';

const TypeHeader = styled.h3`
  margin-bottom: 0;
  font-size: 1.25rem;
  line-height: 1.875rem;
  color: #1f3259;
`;
const FirstRow = styled.section`
  padding: 0em 4em;
  width: 100%;
  @media (max-width: 768px) {
    padding: 0em;
  }
`;
const Headings = styled.div`
  @media (max-width: 768px) {
    padding: 3px 0px;
    max-width: auto;
  }
`;
const PatientsWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 200px);
    overflow: ${(props) => (props?.isInitLoading ? 'hidden' : 'scroll')};
  }
`;

const SearchWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    padding: 0.75rem;
    background: #fff;
  }
`;

const CasesHeader = styled.p`
  margin: 0;
  @media (max-width: 768px) {
    font-family: Helvetica;
    font-weight: bold;
    font-size: 1.25rem;
    line-height: 1.875rem;
    color: #1f3259;
  }
`;

const DeskTopViewPatient = styled.section`
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
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

const DashBoardComponent = () => {
  const dispatch = useDispatch();
  const [selectedCases, setSelectedCases] = useState(RISK.HIGH);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(true);
  const [isFirstFetchStarted, setIsFirstFetchStarted] = useState(false);
  const [page, setPage] = useState(0);

  const user = useSelector(getUser);
  const patients = useSelector(getSearchResult);
  const hasNext = useSelector(getPatientsHasNext);
  const searchText = useSelector(getSearchText);
  const isShowSearchSpinner = useSelector(getIsShowSearchSpinner);
  const { data: patientRiskData } = usePatientsRiskData(user.PractitionerID);
  const searchRef = useRef(null);
  const searchRefMobile = useRef(null);
  const isMobile = useCheckIsMobile();

  const makeSearchRequest = (value) => {
    dispatch(requestSearch({ searchText: value, selectedCases, page }));
  };

  const clearSearchInput = () => {
    if (searchRef?.current?.value) {
      searchRef.current.value = '';
    }
    if (searchRefMobile?.current?.value) {
      searchRefMobile.current.value = '';
    }
    makeSearchRequest('');
  };

  const changesCases = (sel) => {
    setSelectedCases(sel);
    dispatch(requestSearch({ searchText, selectedCases: sel, page }));
  };

  useEffect(() => {
    if (!(user && user.isPractitioner)) {
      return;
    }

    dispatch(requestSearch({ searchText: '', selectedCases, page }));
    setIsFirstFetchStarted(true);
    return () => {
      dispatch(clearSearch());
    };
  }, [user]);

  useEffect(() => {
    if (isFirstFetchStarted && !isShowSearchSpinner) {
      setIsInitLoading(false);
    }
  }, [isShowSearchSpinner]);

  const incrementPage = () => {
    setPage((prevState) => prevState + 1);
    dispatch(requestSearch({ searchText, selectedCases, page: page + 1 }));
  };

  const exportVitals = async () => {
    try {
      setIsDownloading(true);

      const vitals = await patientVitalsService.getPatientVitals(
        user.PractitionerID,
      );

      let vitalDetails = vitals.data.map((vital) => {
        for (var key in vital) {
          var result = key.replace(CAMEL_CASE_REGEX, ' $1');
          var title = result.charAt(0).toUpperCase() + result.slice(1);
          if (title !== key) {
            vital[title] = vital[key];
            delete vital[key];
          }
        }
        return {
          ...vital,
          [VitalsDateFields.updated]: setDateTime(
            vital[VitalsDateFields.updated],
          ),
          [VitalsDateFields.dob]: setDate(vital[VitalsDateFields.dob]),
          [VitalsDateFields.patientSince]: setDate(
            vital[VitalsDateFields.patientSince],
          ),
          [VitalsDateFields.doseOne]: setDate(vital[VitalsDateFields.doseOne]),
          [VitalsDateFields.doseTwo]: setDate(vital[VitalsDateFields.doseTwo]),
        };
      });
      exportToCSV(vitalDetails);
    } catch (err) {
      // TODO: Handle error.
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout style="content-overflow">
      <FirstRow className="mb-4">
        <Headings>
          <InfoWrapper>
            <ViewName>Patients ({patients?.length ?? 0})</ViewName>
            {!isLightVersion && <ViewName>Dashboard</ViewName>}
            <DateAndTimeWrap>
              <TimeImage src={time} />
              <DateAndTime>{getDate()}</DateAndTime>
            </DateAndTimeWrap>
          </InfoWrapper>
          {!isLightVersion && (
            <CasesCardComponent
              casesCardData={patientRiskData}
              changesCases={changesCases}
              selectedCases={selectedCases}
            />
          )}
          <div className="flex justify-content-space-between">
            <SearchWrapper>
              {!isLightVersion && (
                <CasesHeader>{selectedCases} Cases</CasesHeader>
              )}
              <SearchInput
                customClass="mb-2 mt-0 right"
                searchText={searchText}
                requestSearch={makeSearchRequest}
                placeholder="Search by Name, Email or cellphone number"
                searchRef={searchRefMobile}
                clearSearchInput={clearSearchInput}
                isInitLoading={isInitLoading}
              />
              <div className="headsearch-btn-div">
                <Button
                  className="btn btn-download mr-2"
                  disabled={isDownloading}
                  onClick={exportVitals}>
                  {isDownloading ? (
                    <div className="lds-spinner position-absolute">
                      {[...Array(12).keys()].map((i) => (
                        <span key={i} />
                      ))}
                    </div>
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
                      DOWNLOAD (Xls)
                    </>
                  )}
                </Button>
                <LinkButton
                  className="btn btn-covin"
                  to={routes.addPatient.path}>
                  + New Patient
                </LinkButton>
              </div>
            </SearchWrapper>
          </div>
        </Headings>
      </FirstRow>

      {/* Doctors View - Patients List along with current conditions */}
      {isMobile ? (
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
      ) : (
        <DeskTopViewPatient isInitLoading={isInitLoading}>
          <HeaderSearchWrap className="w-100 mb-3">
            {!isLightVersion && (
              <TypeHeader>{selectedCases} Risk Cases</TypeHeader>
            )}
            <InputContainer>
              <SearchInput
                customClass="w-100"
                searchText={searchText}
                requestSearch={makeSearchRequest}
                placeholder="Search by Name, Email or cellphone number"
                searchRef={searchRef}
                clearSearchInput={clearSearchInput}
                isInitLoading={isInitLoading}
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
                    DOWNLOAD (Xls)
                  </>
                )}
              </Button>
              <LinkButton className="btn btn-covin" to={routes.addPatient.path}>
                + New Patient
              </LinkButton>
            </div>
          </HeaderSearchWrap>
          <DesktopPatientTable
            selectedCaseData={patients}
            selectedCases={selectedCases}
            isShowSpinner={isInitLoading}
          />
          {hasNext ? (
            <div className="load-more-container m-3 justify-content-center">
              <Button
                onClick={incrementPage}
                disabled={isInitLoading || isShowSearchSpinner}
                className="btn-load-more btn btn-covin w-25 desktop">
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
      )}
    </DashboardLayout>
  );
};

export default DashBoardComponent;
