import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Fragment,
} from 'react';
import { Table, Button, Card, CardBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { getUser } from 'selectors';
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

import * as patientService from 'services/patient';
import * as patientVitalsService from 'services/patientVitals';
import { routes } from 'routers';
import { getISODate } from 'utils/dateTime';
import { exportToCSV } from 'utils/vitalsDownload';
import { getRandomKey, handleCallAppointment } from 'utils';
import useCheckIsMobile from 'hooks/useCheckIsMobile';
import { getDate } from 'global';
import { GENDER_SHORTHAND, PER_PAGE, RISK, SORT_ORDER } from '../../constants';
import phoneSvg from 'assets/images/svg-icons/icon-phone.svg';
import time from 'assets/images/svg-icons/clock.svg';

const tableHeader = [
  { desc: 'Status', colName: 'Status' },
  { desc: 'Name', colName: 'FirstName' },
  { desc: 'Phone', colName: 'Phone' },
  { desc: 'Gender', colName: 'Gender' },
  { desc: 'Age', colName: 'DateOfBirth' },
  { desc: 'Address', colName: 'Zip' },
  { desc: 'Last Encounter', colName: 'LastEncounter' },
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
  @media (max-width: 768px) {
    margin-bottom: 1.875rem;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 49%;
`;

const Patients = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const riskNames = Object.values(RISK);
  const user = useSelector(getUser);

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isFetching, setIsFetching] = useState(true);

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

  const pagerPageNum = currentPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchText = (e) => {
    setCurrentPage(0);
    setSearchText(e.target.value);
  };

  const fetchPatients = useCallback(
    async (searchText = '') => {
      setIsFetching(true);
      try {
        const response = await patientService.fetchPatients({
          offset: isMobile ? 0 : currentPage * PER_PAGE,
          rowsCount: isMobile ? (currentPage + 1) * PER_PAGE : PER_PAGE,
          searchText,
          sortField,
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
      }
    },
    [currentPage, sortField],
  );

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    searchRef.current.focus();
    const debounced = debounce(fetchPatients, 1000);
    debounced(searchText);

    return () => {
      debounced.cancel();
    };
  }, [searchText]);

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

  const exportVitals = async () => {
    const vitals = await patientVitalsService.getPatientVitals(
      user.PractitionerID,
    );
    exportToCSV(vitals.data);
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
        <InfoColumn>
          <InfoValue>{patients?.length ?? 0} active patients</InfoValue>
          <SearchInput
            placeholder="Search your patient"
            onChange={handleSearchText}
            searchText={searchText}
            searchRef={searchRef}
            customClass="my-2"
          />
        </InfoColumn>
        <InfoColumn>
          <RiskLevelWrap>
            {riskNames.map((risk) => {
              return (
                <Fragment key={getRandomKey()}>
                  <StatusIndicator status={risk} />
                  <InfoValue className="ml-2">
                    {risk} ({patients?.filter((p) => p.status === risk)?.length}
                    )
                  </InfoValue>
                </Fragment>
              );
            })}
          </RiskLevelWrap>
          <Button className="btn btn-covin my-2" onClick={exportVitals}>
            Download Patient Vitals
          </Button>
          <LinkButton
            className="btn btn-covin my-2"
            to={routes.addPatient.path}>
            + New Patient
          </LinkButton>
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
                  className={patient.isSelected ? 'bg-light' : ''}>
                  <td>{index + 1}</td>
                  <td className="pt-3">
                    <StatusIndicator status={patient.status} size={12} />
                  </td>
                  <td>
                    <Link
                      className="patient-link--small"
                      to={`/patients/${patient.patientId}/encounter/create`}>
                      {patient.fullName}
                    </Link>
                  </td>
                  <td>
                    {patient.phone && (
                      <Button
                        className="d-flex"
                        onClick={onCall(patient.patientId)}>
                        <img
                          src={phoneSvg}
                          alt="phone"
                          className="mr-2"
                          size="0.8em"
                        />
                        {patient.phone}
                      </Button>
                    )}
                  </td>
                  <td>{GENDER_SHORTHAND[patient.gender]}</td>
                  <td>{patient.age}</td>
                  <td>{patient.address}</td>
                  <td>{getISODate(patient.lastModifiedDate)}</td>
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
            onChange={handleSearchText}
            searchText={searchText}
            searchRef={searchRef}
            customClass="right"
          />
        </div>
      </InfoColumn>
      <InfoColumn className="bg-white">
        <RiskLevelWrap className="m-0 py-4 px-3 justify-content-between w-100">
          {riskNames.map((risk) => {
            return (
              <div className="d-flex" key={getRandomKey()}>
                <StatusIndicator status={risk} />
                <InfoValue className="ml-2">
                  {risk} ({patients?.filter((p) => p.status === risk)?.length})
                </InfoValue>
              </div>
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
                              to={routes.createEncounter.path.replace(
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
      {!isFetching && (
        <div className="load-more-container mx-3">
          <Button
            onClick={handleLoadMore}
            disabled={disableLoadMore}
            className="btn-load-more btn btn-covin">
            Load More
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>{isMobile ? <MobileView /> : <WebView />}</DashboardLayout>
  );
};

export default Patients;
