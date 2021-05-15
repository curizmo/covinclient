import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardTitle, CardBody, Button, Input } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AiOutlineSend } from 'react-icons/ai';

import { LinkButton } from 'components/common/Button';
import { DashboardLayout } from 'components/common/Layout';
import { QuestionCardModal } from 'components/common/QuestionCard/QuestionCardModal';

import { fetchPractitionerOverviewData } from 'services/practitioner';
import { fetchInProgressAppointment } from 'services/appointment';

import { getAppointment, getUser } from 'selectors';

import { routes } from 'routers';

import { getISODate } from 'utils/dateTime';

import * as appointmentActions from 'actions/appointment';
import { showSpinner, hideSpinner } from 'actions/spinner';

import {
  APPOINTMENT_EVENT_NAME,
  APPOINTMENT_EVENT_STATUSES,
  CALL_METHODS,
} from '../constants';

const Overview = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const [overviewData, setOverviewData] = useState(null);
  const [search, setSearch] = useState('');
  const [displayAskPhoenixModal, setDisplayAskPhoenixModal] = useState(false);
  const history = useHistory();
  const { t } = useTranslation('common');
  const currentAppointment = useSelector(getAppointment);

  const getPractitionerOverviewData = async (authId, date) => {
    dispatch(showSpinner());
    try {
      const response = await fetchPractitionerOverviewData(authId, date);

      if (response.data) {
        const data = { ...response.data[0] };
        data.incompletedAppointments =
          parseInt(data.TotalAppointments) -
          parseInt(data.CompletedAppointments);

        setOverviewData(data);
      }
    } catch (err) {
      setOverviewData(null);
    } finally {
      dispatch(hideSpinner());
    }
  };

  useEffect(() => {
    if (user) {
      const isoDate = getISODate(new Date());
      getPractitionerOverviewData(user.AuthID, isoDate);
    }
  }, [user.AuthID]);

  const handleGoToExamRoom = async () => {
    try {
      const response = await fetchInProgressAppointment();

      const appointment = response.data.appointment;

      if (appointment && appointment.organizationEventBookingId) {
        if (
          appointment.organizationEventName ===
          APPOINTMENT_EVENT_NAME.PhoneVisit
        ) {
          const isCallInProgress = currentAppointment
            ? currentAppointment.isCallInProgress
            : false;

          const hasCallEnded = currentAppointment
            ? currentAppointment.hasCallEnded
            : false;

          const hasAppointmentStarted = currentAppointment
            ? currentAppointment.hasAppointmentStarted
            : false;

          const inProgressAppointment = {
            ...appointment,
            status: APPOINTMENT_EVENT_STATUSES.InProgress,
            callMethod: CALL_METHODS.TWILIO,
            hasAppointmentStarted,
            isCallInProgress,
            hasCallEnded,
          };

          dispatch(appointmentActions.setAppointment(inProgressAppointment));

          history.push(routes.teleHealth.path, {
            appointment: {
              ...inProgressAppointment,
            },
          });
        } else {
          const inProgressAppointment = {
            ...appointment,
            status: APPOINTMENT_EVENT_STATUSES.InProgress,
            callMethod: CALL_METHODS.JITSI,
          };

          dispatch(appointmentActions.setAppointment(inProgressAppointment));

          history.push(routes.teleHealth.path, {
            appointment: {
              ...inProgressAppointment,
            },
          });
        }
      }
    } catch (err) {
      // TODO: Handle error
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    openAskPhoenixModal(true);
  };

  const openAskPhoenixModal = () => {
    setDisplayAskPhoenixModal(true);
  };

  const closeAskPhoenixModal = () => {
    setDisplayAskPhoenixModal(false);
    setSearch('');
  };

  if (!overviewData) return null;

  const {
    CompletedAppointments,
    Currency,
    DisplayName,
    InExamRoom, // the patient name
    IncomeEarned,
    TotalAppointments,
    WaitingRoomPatientCount,
    incompletedAppointments,
  } = overviewData;

  return (
    <DashboardLayout className="w-full">
      {displayAskPhoenixModal && (
        <QuestionCardModal
          closeModal={closeAskPhoenixModal}
          searchTerm={search}
          displayAppendToNote={false}
        />
      )}
      <div className="d-flex justify-content-between w-full flex-wrap mb-5">
        <div>
          <h3>Welcome, {DisplayName}</h3>
          <p>Here’s what’s happening with your business today.</p>
        </div>
        <div className="d-flex justify-content-between">
          <LinkButton
            to={routes.physicianAIInterface.path}
            className="align-self-start ml-2">
            {t('sideBar.physicianAIInterface')}
          </LinkButton>
        </div>
      </div>
      {/* Income Row */}
      <div className="d-flex flex-wrap">
        <Card className="card-status shadow mr-md-3 mb-3">
          <CardTitle>Total Income Earned</CardTitle>
          <CardBody>
            <h3 className="display-4">${IncomeEarned || 0}</h3>
            <p>{Currency}</p>
          </CardBody>
        </Card>
        <Card className="card-status shadow mr-md-3 mb-3">
          <CardTitle>{t('overview.haveAQuestion')}</CardTitle>
          <CardBody>
            <h3 className="display-4">{t('sideBar.qna')}</h3>
          </CardBody>
          <form onSubmit={handleSearchSubmit}>
            <div className="d-flex">
              <Input
                inline={false}
                type="text"
                value={search}
                placeholder="Search for questions"
                onChange={handleSearchChange}
              />
              <Button className="btn-sm ml-2" type="submit">
                <AiOutlineSend />
              </Button>
            </div>
          </form>
        </Card>
      </div>
      {/* Appointments Row */}
      <div className="d-flex flex-wrap">
        {InExamRoom ? (
          <Card className="card-status shadow mr-md-3 mb-3">
            <CardTitle>Currently in the Exam Room</CardTitle>
            <CardBody>
              <h5 className="display-4">{InExamRoom}</h5>
            </CardBody>
            <Button onClick={handleGoToExamRoom} disabled={!InExamRoom}>
              Go to Exam Room
            </Button>
          </Card>
        ) : null}
        <Card className="card-status shadow mr-md-3 mb-3">
          <CardTitle>Currently in the Waiting Room</CardTitle>
          <CardBody>
            <h3 className="display-2">{WaitingRoomPatientCount}</h3>
          </CardBody>
          <LinkButton to={routes.appointments.path}>
            Go to Appointments
          </LinkButton>
        </Card>
        <Card className="card-status shadow mr-md-3 mb-3">
          <CardTitle>Total Appointments Today</CardTitle>
          <CardBody>
            <h3 className="display-2">{TotalAppointments}</h3>
            <p>
              {CompletedAppointments} completed, {incompletedAppointments} left
            </p>
          </CardBody>
          <LinkButton to={routes.appointments.path}>
            Go to Appointments
          </LinkButton>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
