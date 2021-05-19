import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { Table, Button, Card, CardBody } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import { DashboardLayout } from 'components/common/Layout';
import { LinkButton } from 'components/common/Button';
import { CreatePatientTask } from 'components/PatientTaskModal/CreatePatientTask';
import TableLoader from 'assets/loaders/TableLoader';
import TableHeader from 'components/common/TableHeader';
import { StatusIndicator } from 'components/common/StatusIndicator';
import { SearchInput } from 'components/common/SearchInput';

import * as patientService from 'services/patient';
import { routes } from 'routers';
import { getISODate } from 'utils/dateTime';
import useCheckIsMobile from 'hooks/useCheckIsMobile';
import { GENDER_SHORTHAND, PER_PAGE, SORT_ORDER } from '../../constants';
import phoneSvg from 'assets/images/svg-icons/icon-phone.svg';
import { debounce } from 'lodash';
import { handleCallAppointment } from 'utils';

const tableHeader = [
  { desc: 'Status', colName: 'Status' },
  { desc: 'Name', colName: 'FirstName' },
  { desc: 'Phone', colName: 'Phone' },
  { desc: 'Gender', colName: 'Gender' },
  { desc: 'Age', colName: 'DateOfBirth' },
  { desc: 'Address', colName: 'Zip' },
  { desc: 'Last Encounter', colName: 'LastEncounter' },
];

const Patients = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [displayAssignTaskModal, setDisplayAssignTaskModal] = useState(false);

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

  const handlePatientSelect = (selectedPatient) => {
    setSelectedPatient(selectedPatient);
    const newPatients = filteredPatients.map((patient) => ({
      ...patient,
      isSelected:
        patient.patientId === selectedPatient.patientId
          ? !patient.isSelected
          : false,
    }));

    setFilteredPatients(newPatients);
  };

  const closeAssignTaskModal = () => {
    setDisplayAssignTaskModal(false);
  };

  const onCall = useCallback(
    (patientId) => () => handleCallAppointment(dispatch, patientId),
    [dispatch],
  );

  const WebView = () => (
    <div className="webview">
      <div className="mb-3 d-flex justify-content-between">
        <h3 className="page-title">Patients</h3>
      </div>
      <div className="dashboard-header mb-4 d-flex justify-content-between">
        {displayAssignTaskModal && (
          <CreatePatientTask
            handleClose={closeAssignTaskModal}
            patient={selectedPatient}
          />
        )}
        <SearchInput
          placeholder="Search your patient"
          onChange={handleSearchText}
          searchText={searchText}
          searchRef={searchRef}
        />
        <LinkButton className="btn btn-covin" to={routes.addPatient.path}>
          + New Patient
        </LinkButton>
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
                  key={`${patient.email} - ${patient.fullName}`}
                  className={patient.isSelected ? 'bg-light' : ''}
                  onClick={() => {
                    handlePatientSelect(patient);
                  }}>
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
                  <td>{patient.gender}</td>
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
    </div>
  );

  const MobileView = () => (
    <div className="mobileview">
      <div className="header mb-1 d-flex justify-content-between px-3 py-2">
        <h3 className="page-title">Patients</h3>
        <LinkButton className="mr-2 btn btn-covin" to={routes.addPatient.path}>
          + New
        </LinkButton>
      </div>
      <div className="filter-container">
        <SearchInput
          placeholder="Search your patient"
          onChange={handleSearchText}
          searchText={searchText}
          searchRef={searchRef}
        />
      </div>
      <div className="appointment-body-wrapper mb-1">
        {isFetching ? (
          <TableLoader />
        ) : filteredPatients?.length > 0 ? (
          filteredPatients.map((patient) => {
            const { patientId, fullName, age, gender, phone } = patient;
            return (
              <>
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
                              to={`/patients/${patientId}/encounter/create`}>
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
                            <span className="card-value">{gender}</span>
                          </div>
                          <div>
                            <span className="mr-2">Age:</span>
                            <span className="card-value">{age}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </>
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
