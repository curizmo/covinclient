import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { Button, Table, Card, CardBody, Input } from 'reactstrap';
import { AiOutlineCalendar } from 'react-icons/ai';
import { Phone } from 'react-feather';
import ReactTooltip from 'react-tooltip';
import { DateRangePicker } from 'react-dates';
import ReactPaginate from 'react-paginate';
import { Search } from 'react-feather';

import IconVideo from 'assets/images/svg-icons/video.svg';

import { DashboardLayout } from 'components/common/Layout';

import * as appointmentService from 'services/appointment';

import { getUser, getAppointment } from 'selectors';
import {
  useAppointments,
  useAppointmentsMobile,
} from '../../services/appointments';

import * as appointmentActions from 'actions/appointment';

import {
  isToday,
  getISODate,
  getTimeString,
  getDateWithTimezoneOffset,
  getReadableAppointmentDate,
} from 'utils/dateTime';
import { getTabIndex } from 'utils';

import {
  APPOINTMENT_EVENT_STATUS_TEXT,
  APPOINTMENT_EVENT_STATUSES,
  APPOINTMENT_EVENT_NAME,
  APPOINTMENTS_VIEW,
  PHYSICIAN_APPOINTMENTS_VIEWS,
  PAYMENT_STATUSES,
  CALL_METHODS,
  PAYMENT_STATUSES_CLASSESS,
  APPOINTMENT_EVENT_STATUSES_CLASSES,
  ENTER,
  PER_PAGE,
  SORT_ORDER,
} from '../../constants';

import { routes } from 'routers';
import useCheckIsMobile from 'hooks/useCheckIsMobile';
import TableLoader from 'assets/loaders/TableLoader';
import TableHeader from '../../components/common/TableHeader';

const practitionerTableHeader = [
  { desc: 'Time', colName: null },
  { desc: 'Date', colName: 'EventStartTime' },
  { desc: 'Care Team', colName: 'OrganizationName' },
  { desc: 'Patient', colName: 'PatientFirstName' },
  { desc: 'Appointment Type', colName: 'OrganizationEventName' },
  { desc: 'Appointment Status', colName: 'EventStatusDesc' },
  { desc: 'Fee Status', colName: 'PaymentStatusDesc' },
  { desc: 'Action', colName: null },
];

const PractitionerAppointments = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const tableHeader = practitionerTableHeader;

  const currentAppointment = useSelector(getAppointment);

  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState(APPOINTMENTS_VIEW.TODAYS);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [mobFocusedInput, setMobFocusedInput] = useState(null);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const isMobile = useCheckIsMobile();
  const [sortField, setSortField] = useState({
    colName: practitionerTableHeader[1].colName,
    sortOrder: SORT_ORDER.Descending,
  });

  const handleViewSelect = (view) => {
    setCurrentPage(0);
    setView(view);
  };

  const { data: appointmentsData, isFetching } = useAppointments({
    user,
    status: view,
    page: currentPage,
    fromDate,
    toDate,
    searchText,
    sortField,
  });

  const {
    data: appointmentsMobile,
    isFetchingNextPage,
    isFetching: isFetchingMobile,
    fetchNextPage,
  } = useAppointmentsMobile({
    user,
    status: view,
    fromDate,
    toDate,
    searchText,
  });

  const setAppointmentsData = (appointments) => {
    if (appointments) {
      //  TODO: This logic is becoming more and more complaex.
      // Need to refactor this after alpha release.
      const isViewClosed = view !== PHYSICIAN_APPOINTMENTS_VIEWS.CLOSED;

      const isAnyInProgress =
        isViewClosed &&
        appointments.some(
          (appointment) =>
            appointment.eventStatusDesc ===
            APPOINTMENT_EVENT_STATUSES.InProgress,
        );

      appointments = appointments.map((appointment) => {
        const isDateToday = isToday(appointment.eventStartTime);

        return {
          ...appointment,
          clickable:
            isViewClosed &&
            !isAnyInProgress &&
            isDateToday &&
            appointment.eventStatusDesc ===
              APPOINTMENT_EVENT_STATUSES.CheckedIn,
          userName: `${appointment.patientFirstName} ${appointment.patientLastName}`,
          status: APPOINTMENT_EVENT_STATUS_TEXT[appointment.eventStatusDesc],
        };
      });

      setAppointments(appointments);

      const appointmentsGroupedByDate = appointments.reduce(
        (acc, appointment) => {
          let startTime = getReadableAppointmentDate(
            appointment.eventStartTime,
          );
          acc[startTime] = acc[startTime] || [];
          acc[startTime].push(appointment);
          return acc;
        },
        Object.create(null),
      );

      setGroupedAppointments(appointmentsGroupedByDate);
    }
  };

  useEffect(() => {
    if (user && user.AuthID && !isMobile) {
      setAppointmentsData(appointmentsData?.appointments);
    }
  }, [user, appointmentsData, isMobile]);

  useEffect(() => {
    if (user && user.AuthID && isMobile) {
      const appts = appointmentsMobile?.pages.flatMap((a) => a.appointments);
      setAppointmentsData(appts);
      const totalRecords = appointmentsMobile?.pages.flatMap(
        (c) => c.totalRecords,
      );
      const disable =
        (totalRecords &&
          totalRecords.length > 0 &&
          totalRecords[0] <= appts.length) ||
        isFetchingNextPage;
      setDisableLoadMore(disable);
    }
  }, [user, appointmentsMobile, isMobile]);

  const handleAppointmentClick = async (appointment) => {
    await appointmentService.invitePatientToLobby(appointment);

    dispatch(
      appointmentActions.setAppointment({
        ...appointment,
        callMethod: CALL_METHODS.JITSI,
        status: APPOINTMENT_EVENT_STATUSES.InProgress,
      }),
    );

    history.push(routes.teleHealth.path, {
      appointment: { ...appointment, callMethod: CALL_METHODS.JITSI },
    });
  };

  const handleTwilioCallClick = async (appointment) => {
    if (currentAppointment.isCallInProgress) {
      return;
    }

    await appointmentService.invitePatientToLobby(appointment);

    dispatch(
      appointmentActions.setAppointment({
        ...appointment,
        callMethod: CALL_METHODS.TWILIO,
        status: APPOINTMENT_EVENT_STATUSES.InProgress,
        isCallInProgress: false,
        hasCallEnded: false,
        hasAppointmentStarted: true,
      }),
    );
  };

  const joinCall = (appointment) => {
    if (appointment.eventStatusDesc !== APPOINTMENT_EVENT_STATUSES.InProgress) {
      return;
    }
    const callMethod =
      appointment.organizationEventName === APPOINTMENT_EVENT_NAME.PhoneVisit
        ? CALL_METHODS.TWILIO
        : CALL_METHODS.JITSI;

    const isCallInProgress = currentAppointment
      ? currentAppointment.isCallInProgress
      : false;

    const hasCallEnded = currentAppointment
      ? currentAppointment.hasCallEnded
      : false;

    const hasAppointmentStarted = currentAppointment
      ? currentAppointment.hasAppointmentStarted
      : false;

    dispatch(
      appointmentActions.setAppointment({
        ...appointment,
        callMethod,
        status: APPOINTMENT_EVENT_STATUSES.InProgress,
        isCallInProgress,
        hasCallEnded,
        hasAppointmentStarted,
      }),
    );

    history.push(routes.teleHealth.path, {
      appointment: {
        ...appointment,
        callMethod,
        isCallInProgress,
        hasCallEnded,
        hasAppointmentStarted,
      },
    });
  };

  const onDatesChange = ({ startDate, endDate }) => {
    setFromDate(startDate);
    setToDate(endDate);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected * PER_PAGE);
  };

  const handleSearchText = (e) => {
    setCurrentPage(0);
    setSearchText(e.target.value);
  };

  const handleLoadMore = () => {
    if (disableLoadMore) {
      return;
    }
    const newStartValue = currentPage + 10;
    fetchNextPage({ pageParam: newStartValue });
    setCurrentPage(newStartValue);
  };

  const pageCount = Math.ceil(appointmentsData?.totalRecords / PER_PAGE);
  const pagerPageNum = currentPage / PER_PAGE;
  const showMobileLoader = isFetchingNextPage || isFetchingMobile;

  return (
    <DashboardLayout>
      <h2 className="mb-3 page-title">
        <AiOutlineCalendar className="mr-2" />
        My Appointments
      </h2>

      <div className="webview">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="view-filter-container">
              <Button
                onClick={() => handleViewSelect(APPOINTMENTS_VIEW.TODAYS)}
                className={`${
                  view === APPOINTMENTS_VIEW.TODAYS ? 'active' : ''
                }`}>
                Today&apos;s
              </Button>
              <Button
                onClick={() => handleViewSelect(APPOINTMENTS_VIEW.UPCOMING)}
                className={`${
                  view === APPOINTMENTS_VIEW.UPCOMING ? 'active' : ''
                }`}>
                Upcoming
              </Button>
              <Button
                onClick={() => handleViewSelect(APPOINTMENTS_VIEW.CLOSED)}
                className={`${
                  view === APPOINTMENTS_VIEW.CLOSED ? 'active' : ''
                }`}>
                Closed
              </Button>
            </div>
            <div className="filter-container">
              <div className="search-container">
                <Search className="search-icon" />
                <Input
                  type="search"
                  placeholder="Search by Patient's name or phone number"
                  className="search-input"
                  onChange={handleSearchText}
                />
              </div>
              <div className="date-search-container">
                <div className="date-picker-input">
                  <DateRangePicker
                    startDate={fromDate}
                    startDateId="startdate"
                    endDate={toDate}
                    endDateId="enddate"
                    onDatesChange={onDatesChange}
                    focusedInput={focusedInput}
                    onFocusChange={setFocusedInput}
                    isOutsideRange={() => false}
                    hideKeyboardShortcutsPanel={true}
                    displayFormat="MMM DD"
                    daySize={32}
                    minimumNights={0}
                  />
                </div>
                <div className="date-picker">
                  <AiOutlineCalendar className="date-picker-icon" />
                </div>
              </div>
            </div>
          </div>
          {appointments && appointments.length > 0 ? (
            <>
              {isFetching && <TableLoader />}
              {!isFetching && (
                <Table hover responsive className="table-container">
                  <thead className="table-header">
                    <tr>
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
                    {appointments.map((appointment) => {
                      const {
                        organizationEventBookingId,
                        organizationName,
                        organizationEventName,
                        paymentStatusDesc,
                        eventStartTime,
                        patientId,
                        eventEndTime,
                        clickable,
                        userName,
                        status,
                      } = appointment;
                      const isAdmit = clickable;
                      const isJoin =
                        appointment.eventStatusDesc ===
                        APPOINTMENT_EVENT_STATUSES.InProgress;
                      const isPhone =
                        appointment.organizationEventName ===
                        APPOINTMENT_EVENT_NAME.PhoneVisit;
                      const isCallInProgress =
                        currentAppointment.isCallInProgress;
                      return (
                        <tr
                          key={organizationEventBookingId}
                          className={`${
                            clickable &&
                            status === APPOINTMENT_EVENT_STATUS_TEXT.CheckedIn
                              ? 'bg-info'
                              : ''
                          }`}>
                          <td>{`${getTimeString(
                            getDateWithTimezoneOffset(eventStartTime),
                          )} - ${getTimeString(
                            getDateWithTimezoneOffset(eventEndTime),
                          )}`}</td>
                          <td>
                            {getISODate(
                              getDateWithTimezoneOffset(eventStartTime),
                            )}
                          </td>
                          <td>{organizationName}</td>
                          <td>
                            <Link
                              className="patient-link--small"
                              to={`/patients/${patientId}/encounters`}
                              target="_blank">
                              {userName}
                            </Link>
                          </td>
                          <td>{organizationEventName}</td>
                          <td
                            className={
                              APPOINTMENT_EVENT_STATUSES_CLASSES[status]
                            }>
                            {status}
                          </td>
                          <td
                            className={
                              PAYMENT_STATUSES_CLASSESS[paymentStatusDesc]
                            }>
                            {PAYMENT_STATUSES[paymentStatusDesc]}
                          </td>
                          <td>
                            {isAdmit && (
                              <>
                                {isPhone ? (
                                  <>
                                    <Phone
                                      role="button"
                                      tabIndex={getTabIndex()}
                                      className={`${
                                        isCallInProgress
                                          ? 'action-disabled'
                                          : ''
                                      } mx-1`}
                                      onKeyPress={(e) => {
                                        if (e.key === ENTER) {
                                          handleTwilioCallClick(appointment);
                                        }
                                      }}
                                      onClick={() =>
                                        handleTwilioCallClick(appointment)
                                      }
                                      data-tip
                                      data-for={`${organizationEventBookingId}-call`}
                                    />
                                    <ReactTooltip
                                      id={`${organizationEventBookingId}-call`}
                                      place="bottom"
                                      effect="float">
                                      Call
                                    </ReactTooltip>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      role="button"
                                      tabIndex={getTabIndex()}
                                      onKeyPress={(e) => {
                                        if (e.key === ENTER) {
                                          handleAppointmentClick(appointment);
                                        }
                                      }}
                                      onClick={() =>
                                        handleAppointmentClick(appointment)
                                      }
                                      data-tip
                                      data-for={`${organizationEventBookingId}-enter-exam-room`}>
                                      <img
                                        alt="video icon"
                                        className="Icon"
                                        src={IconVideo}
                                      />
                                      <ReactTooltip
                                        id={`${organizationEventBookingId}-enter-exam-room`}
                                        place="bottom"
                                        effect="float">
                                        Enter Exam Room
                                      </ReactTooltip>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                            {isJoin && (
                              <>
                                {isPhone ? (
                                  <>
                                    <Phone
                                      role="button"
                                      tabIndex={getTabIndex()}
                                      className={`${
                                        isCallInProgress
                                          ? 'action-disabled'
                                          : ''
                                      } mx-2`}
                                      onKeyPress={(e) => {
                                        if (e.key === ENTER) {
                                          joinCall(appointment);
                                        }
                                      }}
                                      onClick={() => joinCall(appointment)}
                                      data-tip
                                      data-for={`${organizationEventBookingId}-join-call`}
                                    />
                                    <span className="p opaque">Join Call</span>

                                    <ReactTooltip
                                      id={`${organizationEventBookingId}-join-call`}
                                      place="bottom"
                                      effect="float">
                                      Join Call
                                    </ReactTooltip>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      role="button"
                                      tabIndex={getTabIndex()}
                                      className={`${
                                        isCallInProgress
                                          ? 'action-disabled'
                                          : ''
                                      }`}
                                      onKeyPress={(e) => {
                                        if (e.key === ENTER) {
                                          joinCall(appointment);
                                        }
                                      }}
                                      onClick={() => joinCall(appointment)}
                                      data-tip
                                      data-for={`${organizationEventBookingId}-join-call`}>
                                      <img
                                        alt="video icon"
                                        src={IconVideo}
                                        className="mx-2"
                                      />
                                      <ReactTooltip
                                        id={`${organizationEventBookingId}-join-call`}
                                        place="bottom"
                                        effect="float">
                                        Enter Exam Room
                                      </ReactTooltip>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
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
            </>
          ) : (
            <p className="pl-4 pb-3">No appointments</p>
          )}
        </div>
      </div>
      <div className="mobileview">
        <div className="header">
          <Button
            onClick={() => handleViewSelect(APPOINTMENTS_VIEW.TODAYS)}
            className={`${
              view === APPOINTMENTS_VIEW.TODAYS ? 'active' : ''
            } schedule-btn`}>
            Today&apos;s
          </Button>
          <Button
            onClick={() => handleViewSelect(APPOINTMENTS_VIEW.UPCOMING)}
            className={`${
              view === APPOINTMENTS_VIEW.UPCOMING ? 'active' : ''
            } schedule-btn`}>
            Upcoming
          </Button>
          <Button
            onClick={() => handleViewSelect(APPOINTMENTS_VIEW.CLOSED)}
            className={`${
              view === APPOINTMENTS_VIEW.CLOSED ? 'active' : ''
            } schedule-btn`}>
            Closed
          </Button>
        </div>
        <div className="filter-container">
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              type="search"
              placeholder="Search by Patient's name or phone number"
              className="search-input"
              onChange={handleSearchText}
            />
          </div>
          <div className="date-search-container">
            <div className="date-picker-input">
              <DateRangePicker
                startDate={fromDate}
                startDateId="startdate-mob"
                endDate={toDate}
                endDateId="enddate-mob"
                onDatesChange={onDatesChange}
                focusedInput={mobFocusedInput}
                onFocusChange={setMobFocusedInput}
                isOutsideRange={() => false}
                hideKeyboardShortcutsPanel={true}
                displayFormat="MMM DD"
                orientation={'vertical'}
                daySize={30}
              />
            </div>
            <div className="date-picker">
              <AiOutlineCalendar className="date-picker-icon" />
            </div>
          </div>
        </div>
        <div className="appointment-body-wrapper">
          {showMobileLoader && <TableLoader />}
          {appointments && appointments.length > 0 && !showMobileLoader ? (
            Object.keys(groupedAppointments).map((groupedDate) => {
              return (
                <>
                  <div className="date-bar">{groupedDate}</div>
                  {groupedAppointments[groupedDate].map((appointment) => {
                    const {
                      organizationEventBookingId,
                      organizationName,
                      organizationEventName,
                      paymentStatusDesc,
                      eventStartTime,
                      patientId,
                      eventEndTime,
                      clickable,
                      userName,
                      status,
                    } = appointment;
                    const isAdmit = clickable;
                    const isJoin =
                      appointment.eventStatusDesc ===
                      APPOINTMENT_EVENT_STATUSES.InProgress;
                    const isPhone =
                      appointment.organizationEventName ===
                      APPOINTMENT_EVENT_NAME.PhoneVisit;
                    const isCallInProgress =
                      currentAppointment.isCallInProgress;
                    return (
                      <>
                        <Card className="mb-1 appointment-info-card">
                          <CardBody>
                            <div className="card-info-body">
                              <div className="card-info card-time-info">
                                <span className="font-weight-bold h5">
                                  {`${getTimeString(
                                    getDateWithTimezoneOffset(eventStartTime),
                                  )}`}
                                </span>
                                <span>
                                  {`${getTimeString(
                                    getDateWithTimezoneOffset(eventEndTime),
                                  )}`}
                                </span>
                              </div>
                              <div className="appointment-info-div">
                                <div className="card-div">
                                  <Link
                                    className="patient-link--small card-name mb-2"
                                    to={`/patients/${patientId}/encounters`}
                                    target="_blank">
                                    {userName}
                                  </Link>
                                </div>
                                <div className="card-div">
                                  <span className="card-text mr-2">
                                    {organizationName}
                                  </span>
                                  <span className="card-text">
                                    {organizationEventName}
                                  </span>
                                </div>
                                <div className="card-div">
                                  <div className="card-info">
                                    <span className="opaque card-text mr-2">
                                      Appointment Status
                                    </span>
                                    <span
                                      className={`${APPOINTMENT_EVENT_STATUSES_CLASSES[status]} .card-text`}>
                                      {status}
                                    </span>
                                  </div>
                                  <div className="card-info">
                                    <span className="opaque card-text">
                                      Fee Status
                                    </span>
                                    <span
                                      className={`${PAYMENT_STATUSES_CLASSESS[paymentStatusDesc]} .card-text`}>
                                      {PAYMENT_STATUSES[paymentStatusDesc]}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              {isAdmit && (
                                <>
                                  {isPhone ? (
                                    <>
                                      <div
                                        role="button"
                                        tabIndex={getTabIndex()}
                                        className={`${
                                          isCallInProgress
                                            ? 'action-disabled'
                                            : ''
                                        } enter-exam-room-div`}
                                        onKeyPress={(e) => {
                                          if (e.key === ENTER) {
                                            handleTwilioCallClick(appointment);
                                          }
                                        }}
                                        onClick={() =>
                                          handleTwilioCallClick(appointment)
                                        }
                                        data-tip
                                        data-for={`${organizationEventBookingId}-call`}>
                                        <Phone className="mx-1" />
                                        <span className="opaque card-btn-text">
                                          Call
                                        </span>
                                        <ReactTooltip
                                          id={`${organizationEventBookingId}-call`}
                                          place="bottom"
                                          effect="float">
                                          Call
                                        </ReactTooltip>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        role="button"
                                        tabIndex={getTabIndex()}
                                        className="enter-exam-room-div"
                                        onKeyPress={(e) => {
                                          if (e.key === ENTER) {
                                            handleAppointmentClick(appointment);
                                          }
                                        }}
                                        onClick={() =>
                                          handleAppointmentClick(appointment)
                                        }
                                        data-tip
                                        data-for={`${organizationEventBookingId}-enter-exam-room`}>
                                        <img
                                          alt="video icon"
                                          className="Icon mx-2"
                                          src={IconVideo}
                                        />
                                        <span className="opaque card-btn-text">
                                          Enter Exam Room
                                        </span>
                                        <ReactTooltip
                                          id={`${organizationEventBookingId}-enter-exam-room`}
                                          place="bottom"
                                          effect="float">
                                          Enter Exam Room
                                        </ReactTooltip>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                              {isJoin && (
                                <>
                                  {isPhone ? (
                                    <>
                                      <div
                                        role="button"
                                        tabIndex={getTabIndex()}
                                        className={`${
                                          isCallInProgress
                                            ? 'action-disabled'
                                            : ''
                                        } mx-2 enter-exam-room-div`}
                                        onKeyPress={(e) => {
                                          if (e.key === ENTER) {
                                            joinCall(appointment);
                                          }
                                        }}
                                        onClick={() => joinCall(appointment)}
                                        data-tip
                                        data-for={`${organizationEventBookingId}-join-call`}>
                                        <Phone tabIndex={getTabIndex()} />
                                        <span className="card-btn-text opaque">
                                          Join Call
                                        </span>

                                        <ReactTooltip
                                          id={`${organizationEventBookingId}-join-call`}
                                          place="bottom"
                                          effect="float">
                                          Join Call
                                        </ReactTooltip>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        role="button"
                                        tabIndex={getTabIndex()}
                                        className={`${
                                          isCallInProgress
                                            ? 'action-disabled'
                                            : ''
                                        } mx-2 enter-exam-room-div`}
                                        onKeyPress={(e) => {
                                          if (e.key === ENTER) {
                                            joinCall(appointment);
                                          }
                                        }}
                                        onClick={() => joinCall(appointment)}
                                        data-tip
                                        data-for={`${organizationEventBookingId}-join-call`}>
                                        <img
                                          alt="video icon"
                                          className="Icon mx-2"
                                          src={IconVideo}
                                        />
                                        <span className="card-btn-text opaque">
                                          Enter Exam Room
                                        </span>

                                        <ReactTooltip
                                          id={`${organizationEventBookingId}-join-call`}
                                          place="bottom"
                                          effect="float">
                                          Enter Exam Room
                                        </ReactTooltip>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </>
                    );
                  })}
                </>
              );
            })
          ) : (
            <p className="pl-4 pb-3">No appointments</p>
          )}
        </div>
        {!showMobileLoader && (
          <div className="load-more-container">
            <Button
              onClick={handleLoadMore}
              disabled={disableLoadMore}
              className="btn-load-more">
              Load More
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PractitionerAppointments;
