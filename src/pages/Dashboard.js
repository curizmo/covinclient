import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import CasesCardComponent from 'components/CasesCard';
import { DashboardLayout } from 'components/common/Layout';
import { SearchInput } from 'components/common/SearchInput';
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
  getPatientsHasNext,
} from 'selectors';

import { usePatientsRiskData } from '../services/practitioner';
import * as patientVitalsService from 'services/patientVitals';

import { isLightVersion } from '../config';

import { RISK, SPINNERS, VitalsDateFields } from '../constants';
import { CAMEL_CASE_REGEX } from '../constants/regex';

import { routes } from 'routers';

import { clearSearch, requestSearch } from 'actions/search';

import useCheckIsMobile from 'hooks/useCheckIsMobile';
import { DesktopView } from 'components/Dashboard/DesktopView';
import { MobileView } from 'components/Dashboard/MobileView';
import { showCustomSpinner } from 'actions';

const FirstRow = styled.section`
  padding: 0em 4em;
  width: 100%;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    padding: 0em;
    margin-bottom: 0;
  }
`;
const Headings = styled.div`
  @media (max-width: 768px) {
    padding: 3px 0px;
    max-width: auto;
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

// @toDo remove condition
const isShowNewButton = false;

const DashBoardComponent = () => {
  const dispatch = useDispatch();
  const [selectedCases, setSelectedCases] = useState(RISK.HIGH);
  const [isDownloading, setIsDownloading] = useState(false);
  const [page, setPage] = useState(0);
  const [patients, setPatients] = useState([]);

  const user = useSelector(getUser);
  const fetchedPatients = useSelector(getSearchResult);
  const hasNext = useSelector(getPatientsHasNext);
  const searchText = useSelector(getSearchText);
  const { data: patientRiskData } = usePatientsRiskData(user.PractitionerID);
  const searchRef = useRef(null);
  const searchRefMobile = useRef(null);
  const isMobile = useCheckIsMobile();

  useEffect(() => {
    if (page > 0) {
      setPatients((patients) => [...patients, ...fetchedPatients]);
    } else {
      setPatients(fetchedPatients);
    }
  }, [fetchedPatients]);

  const makeSearchRequest = (value) => {
    const page = 0;
    dispatch(
      requestSearch({
        searchText: value,
        selectedCases,
        page,
        spinner: SPINNERS.SEARCH,
      }),
    );
    setPage(page);
  };

  const resetSearchValue = () => {
    if (searchRef?.current?.value) {
      searchRef.current.value = '';
    }
    if (searchRefMobile?.current?.value) {
      searchRefMobile.current.value = '';
    }
  };

  const clearSearchInput = () => {
    resetSearchValue();
    makeSearchRequest('');
  };

  const changesCases = (sel) => {
    const page = 0;
    dispatch(showCustomSpinner(SPINNERS.MAIN));
    resetSearchValue();
    dispatch(clearSearch());
    setPatients([]);
    setSelectedCases(sel);
    setPage(page);
    dispatch(
      requestSearch({
        searchText: '',
        selectedCases: sel,
        page,
        spinner: SPINNERS.MAIN,
      }),
    );
  };

  useEffect(() => {
    if (!(user && user.isPractitioner)) {
      return;
    }

    dispatch(showCustomSpinner(SPINNERS.MAIN));
    dispatch(
      requestSearch({
        searchText: '',
        selectedCases,
        page,
        spinner: SPINNERS.MAIN,
      }),
    );
    return () => {
      dispatch(clearSearch());
    };
  }, [user]);

  const incrementPage = () => {
    dispatch(showCustomSpinner(SPINNERS.LOAD_MORE));
    setPage(page + 1);
    dispatch(
      requestSearch({
        searchText,
        selectedCases,
        page: page + 1,
        spinner: SPINNERS.LOAD_MORE,
      }),
    );
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
    <DashboardLayout>
      <FirstRow>
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
              />
              <div className="headsearch-btn-div">
                <Button
                  className="btn btn-download"
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
                      DOWNLOAD ALL (Xls)
                    </>
                  )}
                </Button>
                {isShowNewButton && (
                  <LinkButton
                    className="btn btn-covin"
                    to={routes.addPatient.path}>
                    + New Patient
                  </LinkButton>
                )}
              </div>
            </SearchWrapper>
          </div>
        </Headings>
      </FirstRow>
      {isMobile ? (
        <MobileView
          patients={patients}
          clearSearchInput={clearSearchInput}
          hasNext={hasNext}
          incrementPage={incrementPage}
          searchText={searchText}
        />
      ) : (
        <DesktopView
          makeSearchRequest={makeSearchRequest}
          selectedCases={selectedCases}
          searchRef={searchRef}
          clearSearchInput={clearSearchInput}
          isDownloading={isDownloading}
          exportVitals={exportVitals}
          patients={patients}
          incrementPage={incrementPage}
          hasNext={hasNext}
          page={page}
        />
      )}
    </DashboardLayout>
  );
};

export default DashBoardComponent;
