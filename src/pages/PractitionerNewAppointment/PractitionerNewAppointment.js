import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, FormGroup, Label } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';

import { DashboardLayout } from 'components/common/Layout';
import { SpinnerComponent } from 'components/common/SpinnerPortal/Spinner';
import { Calendar } from 'components/common/Calendar';
import { TileList } from 'components/common/TileList';

import { fetchPatients } from 'services/patient';
import {
  fetchPractitionerOrganizations,
  createBooking,
} from 'services/practitioner';
import { getOrganizationEvents } from 'services/organizationEvent';
import { getPractitionersBySubdomain } from 'services/practitioner';
import { getAvailableAppointmentsDateTime } from 'services/organization';

import { getUser } from 'selectors';

import { currentDate, getISODate, getTimeSlotsList } from 'utils';

import { routes } from 'routers';

import { SORT_ORDER, PER_PAGE } from '../../constants';

const PractitionerNewAppointment = () => {
  const [state, setState] = useState({
    patient: '',
    organization: { value: '', label: '' },
    organizationEvent: '',
    practitioner: { value: '', label: '' },
  });

  const [organizations, setOrganizations] = useState([]);
  const [organizationEvents, setOrganizationEvents] = useState([]);
  const user = useSelector(getUser);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [dateKeys, setDateKeys] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [bookingTime, setBookingTime] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [practitioners, setPractitioners] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getPatients();
    getOrganizations();
  }, []);

  const getPatients = async () => {
    try {
      setIsLoadingPatients(true);
      const response = await fetchPatients({
        offset: 0,
        rowsCount: PER_PAGE,
        searchText: '',
        sortField: {
          colName: 'FirstName',
          sortOrder: SORT_ORDER.Ascending,
        },
      });

      let patients = response.data;

      patients = patients.map((patient) => ({
        ...patient,
        name: `${patient.firstName} ${patient.lastName}`,
        value: patient.patientId,
        label: `${patient.firstName} ${patient.lastName}`,
      }));

      setPatientOptions(patients);
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const getOrganizations = async () => {
    try {
      setIsLoadingOrganizations(true);
      const response = await fetchPractitionerOrganizations(user.NTOUserID);

      let { organizations } = response.data;

      organizations = organizations.map((organization) => ({
        ...organization,
        value: organization.organizationId,
        label: organization.organizationName,
      }));

      setOrganizations(organizations);

      const selectedOrganization = organizations[0];

      const newState = {
        ...state,
        organization: {
          value: selectedOrganization.organizationId,
          label: selectedOrganization.organizationName,
        },
      };

      setState(newState);
      fetchOrganizationEvents(selectedOrganization.organizationId);
      getPractitioners(
        organizations,
        selectedOrganization.organizationId,
        newState,
      );
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsLoadingOrganizations(false);
    }
  };

  const getPractitioners = async (
    organizations,
    selectedOrganizationId,
    state,
  ) => {
    try {
      setIsLoading(true);

      const selectedOrganization = organizations.find(
        (o) => o.organizationId === selectedOrganizationId,
      );
      const response = await getPractitionersBySubdomain({
        subdomain: selectedOrganization.subdomain,
      });

      let { practitioners } = response.data;

      practitioners = practitioners.map((practitioner) => ({
        ...practitioner,
        value: practitioner.practitionerId,
        label: practitioner.displayName,
      }));

      setPractitioners(practitioners);

      setState({
        ...state,
        practitioner: { value: user.PractitionerID, label: user.displayName },
      });
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientSelect = (val) => {
    const newState = {
      ...state,
      patient: val.value,
    };
    setState(newState);
    validateForm(newState, bookingTime);
  };

  const handleOrganizationSelect = (e) => {
    if (e.organizationId === state.organization.value) {
      return;
    }

    const selectedOrganization = organizations.find(
      (organizations) => organizations.organizationId === e.organizationId,
    );

    resetBookingTime();
    const newState = {
      ...state,
      organization: {
        value: selectedOrganization.organizationId,
        label: selectedOrganization.organizationName,
      },
    };

    fetchOrganizationEvents(e.organizationId);

    setState(newState);
  };

  const handleOrganizationEventSelect = (e) => {
    if (e.organizationEventId === state.organizationEvent) {
      return;
    }

    resetBookingTime();

    const newState = {
      ...state,
      organizationEvent: e.organizationEventId,
    };

    fetchAvailableDateTimes(e.organizationEventId, state.practitioner.value);

    setState(newState);
  };

  const handlePractitionerSelect = (e) => {
    if (e.practitionerId === state.practitioner.value) {
      return;
    }

    const selectedPractitioner = practitioners.find(
      (practitioner) => practitioner.practitionerId === e.practitionerId,
    );

    resetBookingTime();

    const newState = {
      ...state,
      practitioner: {
        value: selectedPractitioner.practitionerId,
        label: selectedPractitioner.displayName,
      },
    };

    fetchAvailableDateTimes(state.organizationEvent, e.practitionerId);

    setState(newState);
  };

  const fetchOrganizationEvents = async (organizationId) => {
    try {
      setIsLoading(true);
      const response = await getOrganizationEvents(organizationId);

      let { organizationEvents } = response.data;

      organizationEvents = organizationEvents.map((event) => ({
        ...event,
        value: event.organizationEventId,
        label: event.organizationEventName,
      }));

      setOrganizationEvents(organizationEvents);
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableDateTimes = async (eventId, practitionerId) => {
    try {
      if (!eventId && !practitionerId) {
        return;
      }
      setIsLoading(true);
      const selectedOrganization = organizations.find(
        (o) => o.organizationId === state.organization.value,
      );

      const selectedDay = getISODate(currentDate());

      const response = await getAvailableAppointmentsDateTime({
        subdomain: selectedOrganization.subdomain,
        practitionerId,
        eventId,
        date: selectedDay,
      });

      const { dateTimeMapping, datesKeys } = response.data;

      setSelectedDay(selectedDay);
      setAvailableDates(dateTimeMapping);
      setDateKeys(datesKeys);
      setTimeSlots(dateTimeMapping[selectedDay]);
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDaySelect = (selectedDay) => {
    setSelectedDay(selectedDay);
    setTimeSlots(availableDates[selectedDay]);
  };

  const resetBookingTime = () => {
    setBookingTime({});
    validateForm(state, {});
  };

  const handleTimeSelect = (time) => {
    const bookingTime = JSON.parse(time.value);

    setBookingTime(bookingTime);
    validateForm(state, bookingTime);
  };

  const validateForm = (state, bookingTime) => {
    const { patient, organization, organizationEvent, practitioner } = state;
    if (
      patient &&
      organization &&
      organizationEvent &&
      practitioner &&
      Object.keys(bookingTime).length
    ) {
      setIsValid(true);

      return;
    }

    setIsValid(false);
  };

  const handleCreateAppointment = async () => {
    try {
      if (!isValid) {
        return;
      }

      const { patient, organization, organizationEvent, practitioner } = state;

      setIsLoading(true);

      const payload = {
        organizationId: organization.value,
        patientId: patient,
        organizationEventId: organizationEvent,
        practitionerId: practitioner.value,
        eventStartTime: bookingTime.eventStartTime,
        eventEndTime: bookingTime.eventEndTime,
      };

      await createBooking(payload);

      history.push(routes.appointments.path);
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  };
  const { organization, practitioner } = state;

  return (
    <>
      {isLoadingOrganizations || isLoadingPatients || isLoading ? (
        <SpinnerComponent />
      ) : null}
      <DashboardLayout>
        <Container>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <h2 className="mb-5">Create Appointment</h2>

              <div className="search-dropdown">
                <Label>Organization:</Label>
                <div className="dropdown-input">
                  <Select
                    placeholder="Search your organization"
                    options={organizations}
                    onChange={handleOrganizationSelect}
                    value={{
                      value: organization.value,
                      label: organization.label,
                    }}
                  />
                </div>
              </div>
              <div className="search-dropdown">
                <Label>Patient:</Label>
                <div className="dropdown-input">
                  <Select
                    placeholder="Search your patients"
                    options={patientOptions}
                    onChange={handlePatientSelect}
                    isSearchable
                  />
                </div>
              </div>
              <div className="search-dropdown">
                <Label>Service Type:</Label>
                <div className="dropdown-input">
                  <Select
                    placeholder="Please choose service type"
                    options={organizationEvents}
                    onChange={handleOrganizationEventSelect}
                  />
                </div>
              </div>
              <div className="search-dropdown">
                <Label>Practitioner:</Label>
                <div className="dropdown-input">
                  <Select
                    placeholder="Search for practitioners"
                    options={practitioners}
                    onChange={handlePractitionerSelect}
                    value={{
                      value: practitioner.value,
                      label: practitioner.label,
                    }}
                    isSearchable
                  />
                </div>
              </div>
            </Col>
            {dateKeys.length > 0 ? (
              <Calendar
                onDateSelect={handleDaySelect}
                dates={availableDates}
                datesKeys={dateKeys}
                value={selectedDay}
              />
            ) : null}
            <div className="my-3 w-100">
              {timeSlots.length > 0 ? (
                <TileList
                  list={getTimeSlotsList(timeSlots)}
                  gapsSize={0}
                  onSelect={handleTimeSelect}
                  defaultValue={`{"eventStartTime":"${bookingTime.eventStartTime}","eventEndTime":"${bookingTime.eventEndTime}"}`}
                />
              ) : null}
            </div>
            <Col>
              <FormGroup row>
                <Col sm={{ size: 10, offset: 2 }}>
                  <Button onClick={handleCreateAppointment} disabled={!isValid}>
                    Create Appointment
                  </Button>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </DashboardLayout>
    </>
  );
};

export { PractitionerNewAppointment };
