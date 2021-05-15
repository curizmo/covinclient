import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
} from 'reactstrap';
import { AiOutlineCalendar } from 'react-icons/ai';
import IconVideo from 'assets/images/svg-icons/video.svg';
import { Check, XCircle, Clipboard, LogIn } from 'react-feather';
import ReactTooltip from 'react-tooltip';

import { DashboardLayout } from 'components/common/Layout';
import { YesNoModal } from 'components/common/Modal/YesNoModal';
import { Payment } from 'components/common/Payment';

import * as appointmentService from 'services/appointment';
import * as appointmentsService from 'services/appointments';
import { fetchPatientEventCredit } from 'services/patient';

import { getUser } from 'selectors';

import { checkAppointment } from 'actions/patient';
import { showSpinner, hideSpinner } from 'actions/spinner';
import * as appointmentActions from 'actions/appointment';

import { sortByStatusAndTime } from 'utils/appointments';
import {
  isToday,
  getISODate,
  getTimeString,
  getReadableAppointmentDate,
  getDateWithTimezoneOffset,
} from 'utils/dateTime';
import { getLobbyPath, getTabIndex } from 'utils';

import {
  APPOINTMENT_EVENT_STATUS_TEXT,
  APPOINTMENT_EVENT_STATUSES,
  APPOINTMENT_EVENT_NAME,
  APPOINTMENTS_VIEW,
  PAYMENT_STATUSES,
  CALL_METHODS,
  PAYMENT_STATUSES_CLASSESS,
  APPOINTMENT_EVENT_STATUSES_CLASSES,
  ENTER,
} from '../../constants';

import { routes } from 'routers';

const tableHeader = [
  'Time',
  'Date',
  'Care Team',
  'Practitioner',
  'Appointment Type',
  'Appointment Status',
  'Fee Status',
  'Action',
];

const PatientAppointments = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const { subdomain } = useParams();
  const [displayCancelModal, setDisplayCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState(APPOINTMENTS_VIEW.UPCOMING);
  const [displayConfirmAppointmentModal, setDisplayConfirmAppointmentModal] =
    useState(false);
  const [checkBookingMessage, setCheckBookingMessage] = useState({});
  const [patientEventCredit, setPatientEventCredit] = useState(0);
  const [displayPaymentModal, setDisplayPaymentModal] = useState(false);
  const [groupedAppointments, setGroupedAppointments] = useState({});

  const handleViewSelect = (view) => {
    setView(view);
  };

  const fetchAppointments = useCallback(async () => {
    dispatch(showSpinner());
    try {
      const response = await appointmentsService.fetchAppointments({
        user,
        status: view,
      });

      let appointments = response;
      if (subdomain) {
        appointments = appointments.filter(
          (appointment) => appointment.subdomain === subdomain,
        );
      }

      //  TODO: This logic is becoming more and more complaex.
      // Need to refactor this after alpha release.
      const isViewClosed =
        view.toLowerCase() === APPOINTMENTS_VIEW.CLOSED.toLowerCase();

      const isAnyCheckedIn =
        !isViewClosed &&
        appointments.some(
          (appointment) =>
            appointment.eventStatusDesc ===
            APPOINTMENT_EVENT_STATUSES.CheckedIn,
        );
      const isAnyInProgress =
        !isViewClosed &&
        appointments.some(
          (appointment) =>
            appointment.eventStatusDesc ===
            APPOINTMENT_EVENT_STATUSES.InProgress,
        );

      appointments = appointments.map((appointment) => {
        const isDateToday = isToday(appointment.eventStartTime);

        return {
          ...appointment,
          isCheckIn:
            !isViewClosed &&
            !isAnyCheckedIn &&
            !isAnyInProgress &&
            isDateToday &&
            appointment.eventStatusDesc !==
              APPOINTMENT_EVENT_STATUSES.Completed &&
            appointment.eventStatusDesc !==
              APPOINTMENT_EVENT_STATUSES.Requested &&
            appointment.organizationEventName !==
              APPOINTMENT_EVENT_NAME.PhoneVisit,
          isCancellable:
            APPOINTMENT_EVENT_STATUSES.InProgress !==
              appointment.eventStatusDesc && !isViewClosed,
          isConfirmable:
            appointment.eventStatusDesc ===
            APPOINTMENT_EVENT_STATUSES.Requested,

          isJoin:
            appointment.eventStatusDesc ===
              APPOINTMENT_EVENT_STATUSES.InProgress &&
            appointment.organizationEventName !==
              APPOINTMENT_EVENT_NAME.PhoneVisit,
          isGotoLobby:
            appointment.eventStatusDesc ===
              APPOINTMENT_EVENT_STATUSES.CheckedIn &&
            appointment.organizationEventName !==
              APPOINTMENT_EVENT_NAME.PhoneVisit,
          userName: appointment.practitionerDisplayName,
          status: APPOINTMENT_EVENT_STATUS_TEXT[appointment.eventStatusDesc],
        };
      });

      appointments = sortByStatusAndTime(appointments);

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
    } catch (err) {
      setAppointments([]);
    } finally {
      dispatch(hideSpinner());
    }
  }, [dispatch, view]);

  useEffect(() => {
    if (user && user.AuthID && view) {
      fetchAppointments();
    }
  }, [user, fetchAppointments, view]);

  const handleCheckIn = (appointment) => {
    dispatch(
      appointmentActions.setAppointment({
        ...appointment,
        status: APPOINTMENT_EVENT_STATUSES.CheckedIn,
      }),
    );
  };

  const checkIn = (appointmentData) => {
    dispatch(checkAppointment(appointmentData));

    handleCheckIn(appointmentData);
  };

  const joinCall = (appointment) => {
    if (appointment.eventStatusDesc !== APPOINTMENT_EVENT_STATUSES.InProgress) {
      return;
    }

    const currentAppointment = {
      ...appointment,
      callMethod: CALL_METHODS.JITSI,
      status: APPOINTMENT_EVENT_STATUSES.InProgress,
    };

    dispatch(appointmentActions.setAppointment(currentAppointment));

    history.push(routes.teleHealth.path, {
      appointment: currentAppointment,
    });
  };

  const handleCancelBooking = async (appointment) => {
    try {
      dispatch(showSpinner());
      await appointmentService.cancelAppointment(
        appointment.organizationEventBookingId,
      );

      fetchAppointments();
      closeCancelAppointmentModal();
    } catch (err) {
      dispatch(hideSpinner());
      // TODO: Handle error.
    }
  };

  const handleCancelAppointmentClick = (appointment) => {
    setDisplayCancelModal(true);
    setSelectedAppointment(appointment);
  };

  const closeCancelAppointmentModal = () => {
    setDisplayCancelModal(false);
    setSelectedAppointment(null);
  };

  const handleConfirmAppointment = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      dispatch(showSpinner());

      const response = await fetchPatientEventCredit(
        appointment.organizationEventId,
      );

      const { patientEventCredit } = response.data;

      setPatientEventCredit(
        (patientEventCredit && patientEventCredit.creditsLeft) || 0,
      );

      if (patientEventCredit && patientEventCredit.creditsLeft) {
        showConfirmAppointmentModal(
          appointment,
          patientEventCredit.creditsLeft,
        );

        return;
      }

      setDisplayPaymentModal(true);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const showConfirmAppointmentModal = (appointment, patientCredits) => {
    const header = 'Confirm appointment?';
    const paragraphs = [
      `Practitioner: ${appointment.practitionerDisplayName}`,
      `Event type: ${appointment.eventStatusDesc}`,
      `Event date: ${getISODate(appointment.eventStartTime)}`,
      `Event time: ${getTimeString(
        appointment.eventStartTime,
      )} - ${getTimeString(appointment.eventEndTime)}`,
      `To be paid: ${
        patientCredits > 0
          ? '-'
          : `${appointment.eventFee}${appointment.currencyCode}`
      }`,
    ];

    setCheckBookingMessage({ header, paragraphs });
    setDisplayConfirmAppointmentModal(true);
  };

  const hideCheckBookingModal = () => {
    setPatientEventCredit(0);
    setSelectedAppointment(null);
    setDisplayConfirmAppointmentModal(false);
  };

  const hidePaymentModal = () => {
    setPatientEventCredit(0);
    setSelectedAppointment(null);
    setDisplayPaymentModal(false);
  };

  const confirmBooking = async () => {
    try {
      dispatch(showSpinner());

      await appointmentService.confirmAppointment(
        selectedAppointment.organizationEventBookingId,
      );

      hidePaymentModal();
      hideCheckBookingModal();

      fetchAppointments();
    } catch (err) {
      // TODO: Handle error
      dispatch(hideSpinner());
    }
  };

  return (
    <DashboardLayout>
      <h2 className="mb-3 page-title">
        <AiOutlineCalendar className="mr-2" /> My Appointments
      </h2>
      {displayConfirmAppointmentModal && (
        <YesNoModal
          show={displayConfirmAppointmentModal}
          close={hideCheckBookingModal}
          text={checkBookingMessage}
          handleYes={confirmBooking}
          buttons={{
            yes: patientEventCredit ? 'Confirm' : 'Pay',
            no: 'Back',
          }}
        />
      )}
      {displayPaymentModal && (
        <Modal isOpen={displayPaymentModal} toggle={hidePaymentModal} centered>
          <ModalHeader toggle={hidePaymentModal}>Payment</ModalHeader>
          <ModalBody>
            <Payment
              paymentData={{
                confirmBooking,
                currency:
                  selectedAppointment && selectedAppointment.currencyCode,
                amount: selectedAppointment && selectedAppointment.eventFee,
              }}
            />
          </ModalBody>
        </Modal>
      )}
      {displayCancelModal && (
        <Modal
          isOpen={displayCancelModal}
          toggle={closeCancelAppointmentModal}
          centered>
          <ModalHeader toggle={closeCancelAppointmentModal}>
            Cancel Appointment?
          </ModalHeader>
          <ModalBody>
            Are you sure you want to cancel the appointment?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={() => handleCancelBooking(selectedAppointment)}>
              Yes
            </Button>
            <Button color="primary" onClick={closeCancelAppointmentModal}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      )}
      <div className="webview">
        <div className="dashboard-container">
          <div className="header">
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

          {appointments && appointments.length > 0 ? (
            <Table hover responsive className="table-container">
              <thead className="table-header">
                <tr>
                  {tableHeader.map((header) => (
                    <th key={header}>{header}</th>
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
                    eventEndTime,
                    isCheckIn,
                    userName,
                    status,
                    subdomain,
                    isCancellable,
                    isConfirmable,
                    isJoin,
                    isGotoLobby,
                  } = appointment;

                  return (
                    <tr
                      key={organizationEventBookingId}
                      className={`${
                        isCheckIn &&
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
                        {getISODate(getDateWithTimezoneOffset(eventStartTime))}
                      </td>
                      <td>{organizationName}</td>
                      <td>{userName}</td>
                      <td>{organizationEventName}</td>
                      <td
                        className={APPOINTMENT_EVENT_STATUSES_CLASSES[status]}>
                        {status}
                      </td>
                      <td
                        className={
                          PAYMENT_STATUSES_CLASSESS[paymentStatusDesc]
                        }>
                        {PAYMENT_STATUSES[paymentStatusDesc]}
                      </td>
                      <td>
                        {isCheckIn && (
                          <>
                            <Clipboard
                              role="button"
                              tabIndex={getTabIndex()}
                              className="mx-1"
                              onKeyPress={(e) => {
                                if (e.key === ENTER) {
                                  checkIn({
                                    ...appointment,
                                    subdomain,
                                    eventStartTime,
                                    authId: user.AuthID,
                                    bookingId: organizationEventBookingId,
                                    redirectToLobby: () =>
                                      history.push(getLobbyPath(subdomain)),
                                  });
                                }
                              }}
                              onClick={() =>
                                checkIn({
                                  ...appointment,
                                  subdomain,
                                  eventStartTime,
                                  authId: user.AuthID,
                                  bookingId: organizationEventBookingId,
                                  redirectToLobby: () =>
                                    history.push(getLobbyPath(subdomain)),
                                })
                              }
                              data-tip
                              data-for={`${organizationEventBookingId}-check-in`}
                            />
                            <ReactTooltip
                              id={`${organizationEventBookingId}-check-in`}
                              place="bottom"
                              effect="float">
                              Check-in
                            </ReactTooltip>
                          </>
                        )}
                        {isConfirmable && (
                          <>
                            <Check
                              role="button"
                              tabIndex={getTabIndex()}
                              className="mx-1"
                              onKeyPress={(e) => {
                                if (e.key === ENTER) {
                                  handleConfirmAppointment(appointment);
                                }
                              }}
                              onClick={() =>
                                handleConfirmAppointment(appointment)
                              }
                              data-tip
                              data-for={`${organizationEventBookingId}-confirm`}
                              color="#1baf00"
                            />
                            <ReactTooltip
                              id={`${organizationEventBookingId}-confirm`}
                              place="bottom"
                              effect="float">
                              Confirm
                            </ReactTooltip>
                          </>
                        )}
                        {isCancellable && (
                          <>
                            <XCircle
                              role="button"
                              tabIndex={getTabIndex()}
                              className="mx-1"
                              onKeyPress={(e) => {
                                if (e.key === ENTER) {
                                  handleCancelAppointmentClick(appointment);
                                }
                              }}
                              onClick={() =>
                                handleCancelAppointmentClick(appointment)
                              }
                              data-tip
                              data-for={`${organizationEventBookingId}-cancel`}
                              color="red"
                            />
                            <ReactTooltip
                              id={`${organizationEventBookingId}-cancel`}
                              place="bottom"
                              effect="float">
                              Cancel
                            </ReactTooltip>
                          </>
                        )}
                        {isJoin && (
                          <>
                            <div
                              role="button"
                              tabIndex={getTabIndex()}
                              onKeyPress={(e) => {
                                if (e.key === ENTER) {
                                  joinCall(appointment);
                                }
                              }}
                              onClick={() => joinCall(appointment)}
                              data-tip
                              data-for={`${organizationEventBookingId}-enter-exam-room`}>
                              <img
                                alt="video icon"
                                src={IconVideo}
                                className="mx-1"
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
                        {isGotoLobby && (
                          <>
                            <LogIn
                              role="button"
                              tabIndex={getTabIndex()}
                              className="mx-1"
                              onKeyPress={(e) => {
                                if (e.key === ENTER) {
                                  checkIn({
                                    ...appointment,
                                    subdomain,
                                    eventStartTime,
                                    authId: user.AuthID,
                                    bookingId: organizationEventBookingId,
                                    redirectToLobby: () =>
                                      history.push(getLobbyPath(subdomain)),
                                  });
                                }
                              }}
                              onClick={() =>
                                checkIn({
                                  ...appointment,
                                  subdomain,
                                  eventStartTime,
                                  authId: user.AuthID,
                                  bookingId: organizationEventBookingId,
                                  redirectToLobby: () =>
                                    history.push(getLobbyPath(subdomain)),
                                })
                              }
                              data-tip
                              data-for={`${organizationEventBookingId}-go-to-lobby`}
                            />
                            <ReactTooltip
                              id={`${organizationEventBookingId}-go-to-lobby`}
                              place="bottom"
                              effect="float">
                              Go to lobby
                            </ReactTooltip>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p className="pl-4 pb-3">No appointments</p>
          )}
        </div>
      </div>
      <div className="mobileview">
        <div className="header">
          <Button
            onClick={() => handleViewSelect(APPOINTMENTS_VIEW.UPCOMING)}
            className={`${
              view === APPOINTMENTS_VIEW.UPCOMING ? 'active' : ''
            } patient-schedule-btn`}>
            Upcoming
          </Button>
          <Button
            onClick={() => handleViewSelect(APPOINTMENTS_VIEW.CLOSED)}
            className={`${
              view === APPOINTMENTS_VIEW.CLOSED ? 'active' : ''
            } patient-schedule-btn`}>
            Closed
          </Button>
        </div>

        <div className="appointment-body-wrapper">
          {appointments && appointments.length > 0 ? (
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
                      eventEndTime,
                      isCheckIn,
                      userName,
                      status,
                      subdomain,
                      isCancellable,
                      isConfirmable,
                      isJoin,
                      isGotoLobby,
                    } = appointment;

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
                                <div className="card-div">{userName}</div>
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
                              <div className="patient-call-button">
                                {isCheckIn && (
                                  <>
                                    <div
                                      role="button"
                                      className="exam-room-info-button"
                                      tabIndex={getTabIndex()}
                                      onKeyPress={(e) => {
                                        if (e.key === ENTER) {
                                          checkIn({
                                            ...appointment,
                                            subdomain,
                                            eventStartTime,
                                            authId: user.AuthID,
                                            bookingId:
                                              organizationEventBookingId,
                                            redirectToLobby: () =>
                                              history.push(
                                                getLobbyPath(subdomain),
                                              ),
                                          });
                                        }
                                      }}
                                      onClick={() =>
                                        checkIn({
                                          ...appointment,
                                          subdomain,
                                          eventStartTime,
                                          authId: user.AuthID,
                                          bookingId: organizationEventBookingId,
                                          redirectToLobby: () =>
                                            history.push(
                                              getLobbyPath(subdomain),
                                            ),
                                        })
                                      }
                                      data-tip
                                      data-for={`${organizationEventBookingId}-check-in`}>
                                      <Clipboard
                                        role="button"
                                        className="mx-1"
                                      />
                                      <span className="opaque card-btn-text">
                                        Check In
                                      </span>
                                      <ReactTooltip
                                        id={`${organizationEventBookingId}-check-in`}
                                        place="bottom"
                                        effect="float">
                                        Check-in
                                      </ReactTooltip>
                                    </div>
                                  </>
                                )}

                                {isCancellable && (
                                  <>
                                    <div
                                      role="button"
                                      className="exam-room-info-button"
                                      tabIndex={getTabIndex()}
                                      onKeyPress={(e) => {
                                        if (e.key === ENTER) {
                                          handleCancelAppointmentClick(
                                            appointment,
                                          );
                                        }
                                      }}
                                      onClick={() =>
                                        handleCancelAppointmentClick(
                                          appointment,
                                        )
                                      }
                                      data-tip
                                      data-for={`${organizationEventBookingId}-cancel`}>
                                      <XCircle className="mx-1" color="red" />
                                      <span className="opaque card-btn-text">
                                        Cancel
                                      </span>
                                      <ReactTooltip
                                        id={`${organizationEventBookingId}-cancel`}
                                        place="bottom"
                                        effect="float">
                                        Cancel
                                      </ReactTooltip>
                                    </div>
                                  </>
                                )}

                                {isGotoLobby && (
                                  <>
                                    <div
                                      role="button"
                                      className="exam-room-info-button"
                                      tabIndex={getTabIndex()}
                                      onKeyPress={(e) => {
                                        if (e.key === ENTER) {
                                          checkIn({
                                            ...appointment,
                                            subdomain,
                                            eventStartTime,
                                            authId: user.AuthID,
                                            bookingId:
                                              organizationEventBookingId,
                                            redirectToLobby: () =>
                                              history.push(
                                                getLobbyPath(subdomain),
                                              ),
                                          });
                                        }
                                      }}
                                      onClick={() =>
                                        checkIn({
                                          ...appointment,
                                          subdomain,
                                          eventStartTime,
                                          authId: user.AuthID,
                                          bookingId: organizationEventBookingId,
                                          redirectToLobby: () =>
                                            history.push(
                                              getLobbyPath(subdomain),
                                            ),
                                        })
                                      }
                                      data-tip
                                      data-for={`${organizationEventBookingId}-go-to-lobby`}>
                                      <LogIn role="button" className="mx-1" />
                                      <span className="opaque card-btn-text">
                                        Go To Lobby
                                      </span>
                                      <ReactTooltip
                                        id={`${organizationEventBookingId}-go-to-lobby`}
                                        place="bottom"
                                        effect="float">
                                        Go to lobby
                                      </ReactTooltip>
                                    </div>
                                  </>
                                )}
                              </div>
                              {isConfirmable && (
                                <>
                                  <div
                                    role="button"
                                    className="enter-exam-room-div"
                                    tabIndex={getTabIndex()}
                                    onKeyPress={(e) => {
                                      if (e.key === ENTER) {
                                        handleConfirmAppointment(appointment);
                                      }
                                    }}
                                    onClick={() =>
                                      handleConfirmAppointment(appointment)
                                    }
                                    data-tip
                                    data-for={`${organizationEventBookingId}-confirm`}>
                                    <Check
                                      role="button"
                                      className="mx-1"
                                      color="#1baf00"
                                    />
                                    <span className="opaque card-btn-text">
                                      Confirm
                                    </span>
                                    <ReactTooltip
                                      id={`${organizationEventBookingId}-confirm`}
                                      place="bottom"
                                      effect="float">
                                      Confirm
                                    </ReactTooltip>
                                  </div>
                                </>
                              )}
                              {isJoin && (
                                <>
                                  <div
                                    role="button"
                                    tabIndex={getTabIndex()}
                                    className="enter-exam-room-div"
                                    onKeyPress={(e) => {
                                      if (e.key === ENTER) {
                                        joinCall(appointment);
                                      }
                                    }}
                                    onClick={() => joinCall(appointment)}
                                    data-tip
                                    data-for={`${organizationEventBookingId}-enter-exam-room`}>
                                    <img
                                      alt="video-icon"
                                      src={IconVideo}
                                      className="mx-2"
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
      </div>
    </DashboardLayout>
  );
};

export default PatientAppointments;
