import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'reactstrap';

import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import PatientCard from 'components/Dashboard/PatientCard';
import DesktopPatientTable from 'components/DesktopPatientTable';
import CasesCardComponent from 'components/CasesCard';
import { DashboardLayout } from 'components/common/Layout';
import { SearchInput } from 'components/common/SearchInput';
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
import { getUser } from 'selectors';
import {
  usePatientsRiskData,
  usePatientsVitals,
} from '../services/practitioner';
import * as patientVitalsService from 'services/patientVitals';
import { isLightVersion } from '../config';
import { RISK, VitalsDateFields } from '../constants';
import { CAMEL_CASE_REGEX } from '../constants/regex';
import { LinkButton } from 'components/common/Button';
import { routes } from 'routers';

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
  padding: 0rem 0rem 1rem 0rem;
  @media (max-width: 768px) {
    padding: 3px 0px;
    max-width: auto;
  }
`;
const PatientsWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const SearchWrapper = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    padding: 1.25rem;
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
    justify-content: center;
    width: 100%;
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

const DashBoardComponent = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [selectedCases, setSelectedCases] = useState(RISK.HIGH);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const user = useSelector(getUser);
  const { data: patientRiskData } = usePatientsRiskData(user.PractitionerID);
  const { data: patients, refetch } = usePatientsVitals(searchText, dispatch);
  const searchRef = useRef(null);

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const changesCases = (sel) => {
    setSelectedCases(sel);
  };

  useEffect(() => {
    if (searchRef?.current) {
      searchRef.current.focus();
    }
    const debounced = debounce(refetch, 1000);
    debounced();

    return () => {
      debounced.cancel();
    };
  }, [searchText]);

  useEffect(() => {
    setFilteredPatients(
      patients?.filter((p) => p.status === selectedCases) ?? [],
    );
  }, [patients, selectedCases]);

  const exportVitals = async () => {
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
                placeholder="Search"
                searchText={searchText}
                onChange={handleSearchText}
                searchRef={searchRef}
              />
              <div className="headsearch-btn-div">
                <Button className="btn btn-download m-2" onClick={exportVitals}>
                  <span className="excel-image-wrap">
                    <img
                      src={excel}
                      alt="Covin"
                      className="logo download-excel-icon"
                    />
                    <img src={xicon} alt="Covin" className="logo x-icon" />
                  </span>{' '}
                  DOWNLOAD (Xls)
                </Button>
                <LinkButton
                  className="btn btn-covin my-2"
                  to={routes.addPatient.path}>
                  + New Patient
                </LinkButton>
              </div>
            </SearchWrapper>
          </div>
        </Headings>
      </FirstRow>

      {/* Doctors View - Patients List along with current conditions */}
      <PatientsWrapper>
        {patients?.map((patient) => (
          <PatientCard key={patient.patientId} patient={patient} />
        ))}
      </PatientsWrapper>
      <DeskTopViewPatient>
        {patients ? (
          <>
            <HeaderSearchWrap className="w-100 mb-3">
              {!isLightVersion && (
                <TypeHeader>{selectedCases} Risk Cases</TypeHeader>
              )}
              <InputContainer>
                <SearchInput
                  customClass="w-100"
                  placeholder="Search"
                  searchText={searchText}
                  onChange={handleSearchText}
                  searchRef={searchRef}
                />
              </InputContainer>
              <div className="headsearch-btn-div">
                <Button className="btn btn-download m-2" onClick={exportVitals}>
                  <span className="excel-image-wrap">
                    <img
                      src={excel}
                      alt="Covin"
                      className="logo download-excel-icon"
                    />
                    <img src={xicon} alt="Covin" className="logo x-icon" />
                  </span>{' '}
                  DOWNLOAD (Xls)
                </Button>
                <LinkButton
                  className="btn btn-covin my-2"
                  to={routes.addPatient.path}>
                  + New Patient
                </LinkButton>
              </div>
            </HeaderSearchWrap>
            <DesktopPatientTable
              selectedCaseData={isLightVersion ? patients : filteredPatients}
              selectedCases={selectedCases}
            />
          </>
        ) : null}
      </DeskTopViewPatient>
    </DashboardLayout>
  );
};

export default DashBoardComponent;
