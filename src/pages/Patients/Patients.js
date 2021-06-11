import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Fragment,
} from 'react';
import ReactTooltip from 'react-tooltip';
import { Table, Button, Card, CardBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { debounce } from 'lodash';

import { DashboardLayout } from 'components/common/Layout';
import { LinkButton } from 'components/common/Button';
import TableLoader from 'assets/loaders/TableLoader';
import TableHeader from 'components/common/TableHeader';
import { StatusIndicator } from 'components/common/StatusIndicator';
import { SearchInput } from 'components/common/SearchInput';
import {
  DateAndTime,
  DateAndTimeWrap,
  InfoWrapper,
  TimeImage,
  ViewName,
  WebViewWrap,
} from 'global/styles';
import { getUser } from 'selectors';

import * as patientService from 'services/patient';
import * as patientVitalsService from 'services/patientVitals';
import { usePatientsRiskData } from 'services/practitioner';
import { routes } from 'routers';
import { getISODate } from 'utils/dateTime';
import { getRandomKey, handleCallAppointment, getTabIndex } from 'utils';
import { exportToCSV, exportIndividualVitalsToCSV } from 'utils/vitalsDownload';
import useCheckIsMobile from 'hooks/useCheckIsMobile';
import { getDate, setDate, setDateTime } from 'global';
import {
  GENDER_SHORTHAND,
  PER_PAGE,
  SORT_ORDER,
  VitalsDateFields,
  LabDateFields,
} from '../../constants';
import { CAMEL_CASE_REGEX } from '../../constants/regex';
import phoneSvg from 'assets/images/svg-icons/icon-phone.svg';
// import phoneSvgWhite from 'assets/images/svg-icons/icon-phone-white.svg';

import time from 'assets/images/svg-icons/clock.svg';
import excel from 'assets/images/svg-icons/excel.svg';
// import selectArrow from 'assets/images/svg-icons/select-arraow.svg';
import xicon from 'assets/images/x-icon.png';

const tableHeader = [
  { desc: 'Status', colName: 'Status' },
  { desc: 'Name', colName: 'FirstName' },
  { desc: 'Phone', colName: 'Phone' },
  { desc: 'Gender', colName: 'Gender' },
  { desc: 'Age', colName: 'DateOfBirth' },
  { desc: 'Address', colName: 'Zip' },
  { desc: 'Last Encounter', colName: 'LastEncounter' },
  { desc: 'Download', colName: 'Download' },
];

export const InfoValue = styled.p`
  margin-bottom: 0;
  margin-right: 1rem;
  align-self: center;
  font: 400 14px / 1.2 Helvetica;
  color: #657396;
  white-space: nowrap;
`;

const RiskLevelWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 8.5rem;
  // box-shadow: 0 0 0 0.1rem #9fa7ba;
  background: #f2f7fd;
  display: none;
  margin: 0;
  @media (max-width: 768px) {
    margin-bottom: 1.875rem;
  }
`;

const Select = styled.select`
  border: none;
  outline: none;
  background: #f2f7fd;
  height: 2rem;
  position: relative;
  margin-left: 6px;
  margin-top: 0.9rem;
  width: 7.5rem !important;
  color: #22335e;
  font-weight: 700;
  // -webkit-appearance: none;
  // -moz-appearance: none;

  :focus {
    border: none;
    outline: none;
  }

  :focus-visible {
    border: none;
    outline: none;
  }

  font-size: 16px;
  line-height: 20px;
`;

const InfoColumn = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 52%;
`;

const PatientInfoColumn = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 17rem;
`;

const Patients = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const user = useSelector(getUser);

  const [isInitLoading, setIsInitLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingPatientId, setDownloadingPatientId] = useState(null);

  const [riskLevel, setRiskLevel] = useState('High');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const { data: patientRiskData } = usePatientsRiskData(user.PractitionerID);

  const [sortField, setSortField] = useState({
    colName: tableHeader[0]?.colName,
    sortOrder: SORT_ORDER.Ascending,
  });

  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const isMobile = useCheckIsMobile();

  const pageCount = useMemo(
    () => Math.ceil((patients?.[0]?.totalRecords ?? 1) / PER_PAGE),
    [patients],
  );

  const handleLoadMore = () => {
    if (disableLoadMore) {
      return;
    }
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const makeSearchRequest = (value) => {
    setCurrentPage(0);
    setSearchText(value);
  };

  const clearSearchInput = () => {
    if (searchRef?.current?.value) {
      searchRef.current.value = '';
    }
    makeSearchRequest('');
  };

  const pagerPageNum = currentPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchPatients = async () => {
    setIsFetching(true);
    setIsInitLoading(searchText);
    try {
      const response = await patientService.fetchPatients({
        offset: isMobile ? 0 : currentPage * PER_PAGE,
        rowsCount: isMobile ? (currentPage + 1) * PER_PAGE : PER_PAGE,
        searchText: searchText,
        sortField,
        riskLevel,
      });

      let patients = response.data;

      patients = patients.map((patient) => ({
        ...patient,
        gender: GENDER_SHORTHAND[patient.gender],
        isSelected: false,
      }));

      setPatients(patients);
      setFilteredPatients(patients);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
      setIsInitLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    searchRef.current.focus();
    const debounced = debounce(fetchPatients, 1000);
    debounced(searchText);

    return () => {
      debounced.cancel();
    };
  }, [searchText, currentPage, sortField, riskLevel]);

  useEffect(() => {
    if (isMobile) {
      const totalRecords = patients?.[0]?.totalRecords;
      const disable =
        totalRecords && totalRecords <= (currentPage + 1) * PER_PAGE;
      setDisableLoadMore(disable);
    }
  }, [patients, isMobile, currentPage]);

  const onCall = useCallback(
    (patientId) => () => handleCallAppointment(dispatch, patientId),
    [dispatch],
  );

  const getVitals = (vitals) => {
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

    return vitalDetails;
  };

  const exportVitals = async () => {
    try {
      setIsDownloading(true);
      const vitals = await patientVitalsService.getPatientVitals(
        user.PractitionerID,
      );
      const vitalDetails = getVitals(vitals);
      exportToCSV(vitalDetails);
    } catch (err) {
      // TODO: Handle error.
    } finally {
      setIsDownloading(false);
    }
  };

  const exportIndividualVitals = async (patientId) => {
    try {
      setDownloadingPatientId(patientId);

      const [vitals, lab] = await Promise.all([
        patientVitalsService.getIndividualPatientVitals(
          user.PractitionerID,
          patientId,
        ),
        patientVitalsService.getLabResults(user.PractitionerID, patientId),
      ]);
      const vitalDetails = getVitals(vitals);

      let labResults = lab.data.map((lab) => {
        return {
          ...lab,
          [LabDateFields.updated]: setDateTime(lab[LabDateFields.updated]),
          [LabDateFields.specimenDrawnDate]: setDate(
            lab[LabDateFields.specimenDrawnDate],
          ),
        };
      });

      exportIndividualVitalsToCSV(vitalDetails, labResults);
    } catch (err) {
      // TODO: Handle error
    } finally {
      setDownloadingPatientId(null);
    }
  };

  const truncateText = (str) => {
    return str.length > 40 ? str.substring(0, 40) + '...' : str;
  };

  const handleRiskLevelChange = (e) => {
    setRiskLevel(e.target.value);
  };

  const WebView = () => (
    <WebViewWrap>
      <InfoWrapper className="w-100">
        <ViewName>Patients</ViewName>
        <DateAndTimeWrap>
          <TimeImage src={time} />
          <DateAndTime>{getDate()}</DateAndTime>
        </DateAndTimeWrap>
      </InfoWrapper>
      <div className="dashboard-header mb-2 d-flex justify-content-between flex-wrap w-100">
        <PatientInfoColumn>
          <InfoValue>{patients?.length ?? 0} active patients</InfoValue>
          <div className="d-flex justify-content-between">
            <StatusIndicator status={riskLevel} size={12} />
            <div className="d-flex justify-content-between">
              <Select
                value={riskLevel}
                onChange={handleRiskLevelChange}
                onBlur={handleRiskLevelChange}>
                {patientRiskData?.map((risk) => {
                  return (
                    <option
                      key={risk.riskType}
                      value={risk.riskType}
                      className="select-options">
                      {risk.riskType} ({risk.numberOfCases})
                    </option>
                  );
                })}
              </Select>
              {/* <img src={selectArrow} alt="covin" className="select-arrow" /> */}
            </div>
          </div>
        </PatientInfoColumn>
        <InfoColumn>
          <SearchInput
            customClass="my-2"
            searchText={searchText}
            requestSearch={makeSearchRequest}
            placeholder="Search by Name, Email or cellphone number"
            searchRef={searchRef}
            clearSearchInput={clearSearchInput}
            isInitLoading={isInitLoading}
            isPatientSearch={true}
          />
          <div className="headsearch-btn-div">
            <Button
              className="btn btn-download m-2"
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
              className="btn btn-covin my-2"
              to={routes.addPatient.path}>
              + New Patient
            </LinkButton>
          </div>
        </InfoColumn>
      </div>
      <div className="dashboard-container">
        {isFetching ? (
          <TableLoader />
        ) : filteredPatients?.length > 0 ? (
          <Table hover responsive className="table-container">
            <thead className="table-header">
              <tr>
                <TableHeader key="number" title="" />
                {tableHeader.map((header) => (
                  <TableHeader
                    key={header.desc}
                    title={header.desc}
                    header={header}
                    setSortField={setSortField}
                    setCurrentPage={setCurrentPage}
                    sortField={sortField}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr
                  key={getRandomKey()}
                  className={
                    patient.isSelected ? 'bg-light' : 'patient-table-row'
                  }>
                  <td>{index + 1}</td>
                  <td className="pt-3 table-content-status">
                    <StatusIndicator status={patient.status} size={12} />
                  </td>
                  <td>
                    <Link
                      className="patient-link--small table-patient-name"
                      to={routes.editPatient.path.replace(
                        ':patientId',
                        patient.patientId,
                      )}>
                      {patient.fullName}
                    </Link>
                  </td>
                  <td className="table-content-phone">
                    {patient.phone && (
                      <Button
                        className="d-flex button-patient-call"
                        onClick={onCall(patient.patientId)}>
                        <img
                          src={phoneSvg}
                          alt="phone"
                          className="mr-2 phone-icon"
                          size="0.8em"
                        />
                        {patient.phone}
                      </Button>
                    )}
                  </td>
                  <td className="table-content-gender">
                    {patient.gender || '-'}
                  </td>
                  <td className="table-content-age">{patient.age || '-'}</td>
                  <td className="table-content-address">
                    <span data-tip data-for={`${patient.address}`}>
                      {truncateText(patient.address)}
                    </span>
                    <ReactTooltip
                      className="address-tooltip"
                      id={patient.address}
                      place="bottom"
                      effect="float"
                      multiline={true}>
                      {patient.address}
                    </ReactTooltip>
                  </td>
                  <td className="table-content-date">
                    {getISODate(patient.lastModifiedDate)}
                  </td>
                  <td className="table-content-download">
                    <div
                      data-tip={'download'}
                      data-for={'download'}
                      className="download-btn"
                      role="button"
                      disabled={downloadingPatientId === patient.patientId}
                      onClick={() => {
                        exportIndividualVitals(patient.patientId);
                      }}
                      onKeyDown={(e) => {
                        e.key === 'Enter' && exportVitals(patient.patientId);
                      }}
                      tabIndex={getTabIndex()}>
                      {downloadingPatientId === patient.patientId ? (
                        <div className="lds-spinner position-absolute">
                          {[...Array(12).keys()].map((i) => (
                            <span key={i} />
                          ))}
                        </div>
                      ) : (
                        <>
                          <span className="table-excel-wrap">
                            <img
                              src={excel}
                              alt="Covin"
                              className="table-excel-icon"
                            />
                            <img
                              src={xicon}
                              alt="Covin"
                              className="table-x-icon"
                            />
                          </span>
                        </>
                      )}
                    </div>
                    <ReactTooltip id={'download'} place="bottom" effect="float">
                      Download Xls
                    </ReactTooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="p-3">No patients</p>
        )}
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            forcePage={pagerPageNum}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
          />
        </div>
      </div>
    </WebViewWrap>
  );

  const MobileView = () => (
    <div className="mobileview">
      <div className="header d-flex justify-content-between px-3 pt-2 align-items-center">
        <ViewName>Patients</ViewName>
        <LinkButton className="mr-2 btn btn-covin" to={routes.addPatient.path}>
          + New
        </LinkButton>
      </div>
      <InfoColumn className="bg-white">
        <InfoValue className="m-0 px-3">
          {patients?.length ?? 0} active patients
        </InfoValue>
        <div className="filter-container">
          <SearchInput
            placeholder="Search your patient"
            searchText={searchText}
            requestSearch={makeSearchRequest}
            searchRef={searchRef}
            clearSearchInput={clearSearchInput}
            isInitLoading={isInitLoading}
            customClass="right"
            isPatientSearch={true}
          />
        </div>
      </InfoColumn>
      <InfoColumn className="bg-white">
        <RiskLevelWrap className="m-0 py-4 px-3 justify-content-between w-100">
          {patientRiskData?.map((risk) => {
            return (
              <Fragment key={getRandomKey()}>
                <StatusIndicator status={risk.riskType} />
                <InfoValue className="ml-2">
                  {risk.riskType} ({risk.numberOfCases})
                </InfoValue>
              </Fragment>
            );
          })}
        </RiskLevelWrap>
      </InfoColumn>
      <div className="appointment-body-wrapper mb-1">
        {isFetching ? (
          <TableLoader />
        ) : filteredPatients?.length > 0 ? (
          filteredPatients.map((patient) => {
            const { patientId, fullName, age, gender, phone } = patient;
            return (
              <Fragment key={getRandomKey()}>
                <Card className="mb-1 appointment-info-card">
                  <CardBody>
                    <div className="card-info-body">
                      <div className="appointment-info-div w-100">
                        <div className="card-div">
                          <div className="d-flex">
                            <div className="mr-3 pt-1">
                              <StatusIndicator
                                status={patient.status}
                                size={14}
                              />
                            </div>
                            <Link
                              className="patient-link--small card-name mb-2"
                              to={routes.editPatient.path.replace(
                                ':patientId',
                                patientId,
                              )}>
                              {fullName}
                            </Link>
                          </div>
                          <Button
                            className="transparent-button"
                            onClick={onCall(patient.patientId)}>
                            <img
                              src={phoneSvg}
                              alt="phone"
                              className="phone-icon-24"
                            />
                          </Button>
                        </div>
                        <div className="card-div">
                          <div>
                            <span className="mr-2">Mob:</span>
                            <span className="card-value">{phone}</span>
                          </div>
                          <div>
                            <span className="mr-2">Gender:</span>
                            <span className="card-value">{gender || '-'}</span>
                          </div>
                          <div>
                            <span className="mr-2">Age:</span>
                            <span className="card-value">{age || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Fragment>
            );
          })
        ) : (
          <p className="pl-4 pb-3">No patients</p>
        )}
      </div>
      <div className="load-more-container m-3">
        <Button
          onClick={handleLoadMore}
          disabled={disableLoadMore || isFetching}
          className="btn-load-more btn btn-covin">
          {isFetching ? (
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
    </div>
  );

  return (
    <DashboardLayout>{isMobile ? <MobileView /> : <WebView />}</DashboardLayout>
  );
};

export default Patients;
