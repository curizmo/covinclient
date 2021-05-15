import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Label,
} from 'reactstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';

import { hideSpinner, showSpinner } from 'actions/spinner';
import {
  editOrganizationEvent,
  getOrganizationEvent,
} from 'services/organizationEvent';
import { fetchPractitionerOrganizations } from 'services/practitioner';

import { useCreateEditOrganizationEvent } from '../../../hooks/useCreateOrEditOrganizationEvent';

import { routes } from 'routers';

import { getUser } from 'selectors';

const EditOrganizationEvent = () => {
  const {
    organizationEvent,
    setOrganizationEvent,
    isValid,
    dispatch,
    handleChange,
    handleAutoConfirmChange,
    handleBookingTypeSelect,
    handleDaySelect,
    handleEventTypeSelect,
    validateForm,
  } = useCreateEditOrganizationEvent();
  const [organizationEventId, setOrganizationEventId] = useState('');
  const [organizationOptions, setOrganizationOptions] = useState([]);

  const user = useSelector(getUser);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    fetchOrganizationEvent(match.params.organizationEventId);
  }, [match.params.organizationEventId]);

  useEffect(() => {
    fetchOrganizationOptions(user.NTOUserID);
  }, [user.NTOUserID]);

  const fetchOrganizationOptions = async (ntoUserId) => {
    try {
      dispatch(showSpinner());

      const response = await fetchPractitionerOrganizations(ntoUserId);

      const { organizations } = response.data;

      setOrganizationOptions(organizations);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const fetchOrganizationEvent = async (eventId) => {
    try {
      setOrganizationEventId(eventId);

      dispatch(showSpinner());

      const response = await getOrganizationEvent(eventId);

      const { organizationEvent } = response.data;
      const {
        organizationEventId,
        organizationEventName,
        organizationId,
        maxGuestCount,
        availableFrom,
        availableTo,
        bufferAfterEventInMinutes,
        durationInMinutes,
        autoConfirm,
        sessionCount,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        activeFrom,
        activeTo,
        futureRollingDays,
        eventFee,
        currencyCode,
        timeZone,
      } = organizationEvent;

      const newOrganizationEvent = {
        organizationEventId,
        eventName: organizationEventName,
        organization: organizationId,
        isGroupEvent: maxGuestCount > 1,
        maxCount: maxGuestCount,
        activeFrom,
        activeTo: activeTo || '',
        buffer: bufferAfterEventInMinutes,
        duration: durationInMinutes,
        autoConfirm,
        isMultipleSession: sessionCount > 1,
        sessionCount,
        days: {
          Monday: monday,
          Tuesday: tuesday,
          Wednesday: wednesday,
          Thursday: thursday,
          Friday: friday,
          Saturday: saturday,
          Sunday: sunday,
        },
        startTime: availableFrom,
        endTime: availableTo,
        futureRollingDays,
        eventFee,
        currencyCode,
        timezone: timeZone,
      };

      setOrganizationEvent(newOrganizationEvent);

      validateForm(newOrganizationEvent);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const handleSave = async () => {
    try {
      if (!isValid) {
        return;
      }

      dispatch(showSpinner());

      await editOrganizationEvent(organizationEvent, organizationEventId);

      history.push(routes.viewOrganizationEvent.path);
    } catch (err) {
      // TODO: Handle error.
    } finally {
      dispatch(hideSpinner());
    }
  };

  const {
    eventName,
    organization,
    isGroupEvent,
    maxCount,
    activeFrom,
    activeTo,
    buffer,
    duration,
    autoConfirm,
    isMultipleSession,
    sessionCount,
    days,
    startTime,
    endTime,
    futureRollingDays,
    eventFee,
    currencyCode,
    timezone,
  } = organizationEvent;

  return (
    <DashboardLayout>
      <Container>
        <h2 className="mb-5">Edit organization event</h2>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <InputField
              labelSize={3}
              title="Event Name: *"
              type="text"
              name="eventName"
              value={eventName}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              title="Organization: *"
              type="select"
              onBlur={handleChange}
              onChange={handleChange}
              placeholder="Choose organization"
              value={organization}
              name="organization">
              {organizationOptions.map(
                ({ organizationName, organizationId }) => (
                  <option
                    key={organizationId}
                    value={organizationId}
                    className="p-2">
                    {organizationName}
                  </option>
                ),
              )}
            </InputField>
            <FormGroup row>
              <Label sm={3}>Event type: *</Label>
              <Col sm={6} className="mt-3">
                <span className="mr-5">
                  <Input
                    id="one-on-one"
                    type="radio"
                    className="mr-1"
                    value={'oneOnOne'}
                    onChange={handleEventTypeSelect}
                    checked={!isGroupEvent}></Input>
                  <label htmlFor="one-on-one">One on one</label>
                </span>
                <span className="mr-5">
                  <Input
                    id="group-visit"
                    type="radio"
                    className="mr-1"
                    value={'groupVisit'}
                    onChange={handleEventTypeSelect}
                    checked={isGroupEvent}></Input>
                  <label htmlFor="group-visit">Group visit</label>
                </span>
              </Col>
            </FormGroup>
            <InputField
              labelSize={3}
              type="number"
              title="Max guests: *"
              name="maxCount"
              value={maxCount}
              min={2}
              disabled={!isGroupEvent}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              type="date"
              title="Active from: *"
              name="activeFrom"
              value={activeFrom}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              type="date"
              title="Active to:"
              name="activeTo"
              value={activeTo}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              type="number"
              title="Duration (in mins): *"
              name="duration"
              value={duration}
              min={1}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              type="number"
              title="Buffer between session (in mins): *"
              name="buffer"
              value={buffer}
              min={0}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              type="checkbox"
              title="Auto confirm booking?:"
              name="autoConfirm"
              checked={autoConfirm}
              onChange={handleAutoConfirmChange}
            />
            <FormGroup row>
              <Label sm={3}>Booking option:</Label>
              <Col sm={6} className="mt-3">
                <span className="mr-5">
                  <Input
                    id="one-session"
                    type="radio"
                    className="mr-1"
                    value={'oneSession'}
                    onChange={handleBookingTypeSelect}
                    checked={!isMultipleSession}></Input>
                  <label htmlFor="one-session">
                    Schedule and pay one session at a time
                  </label>
                </span>
                <span className="mr-5">
                  <Input
                    id="multiple-session"
                    type="radio"
                    className="mr-1"
                    value={'multipleSession'}
                    onChange={handleBookingTypeSelect}
                    checked={isMultipleSession}></Input>
                  <label htmlFor="multiple-session">
                    Pay for multiple sessions
                  </label>
                </span>
              </Col>
            </FormGroup>
            <InputField
              labelSize={3}
              type="number"
              title="No. of sessions: *"
              name="sessionCount"
              value={sessionCount}
              min={2}
              disabled={!isMultipleSession}
              onChange={handleChange}
            />
            <FormGroup>
              <Label sm={3}>Day:</Label>
              {Object.keys(days).map((key) => {
                const value = days[key];

                return (
                  <span className="mr-3" key={key}>
                    <input
                      className="mr-2"
                      name={key}
                      checked={value}
                      onChange={handleDaySelect}
                      type="checkbox"
                    />
                    {key}
                  </span>
                );
              })}
            </FormGroup>
            <InputField
              labelSize={3}
              type="time"
              title="Start Time: *"
              name="startTime"
              value={startTime}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              type="time"
              title="End Time: *"
              name="endTime"
              value={endTime}
              onChange={handleChange}
            />

            <InputField
              labelSize={3}
              title="Time zone: *"
              type="select"
              onBlur={handleChange}
              onChange={handleChange}
              placeholder="Choose timezone"
              value={timezone}
              name="timezone">
              <option value={'PST'} className="p-2">
                PST
              </option>
            </InputField>

            <InputField
              labelSize={3}
              type="number"
              title="Book ahead days: *"
              name="futureRollingDays"
              value={futureRollingDays}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              title="Event Fee: *"
              type="number"
              className="mr-1"
              value={eventFee}
              min={0}
              name="eventFee"
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              title="Currency Code: *"
              type="select"
              onBlur={handleChange}
              onChange={handleChange}
              placeholder="Choose currency code"
              value={currencyCode}
              name="currencyCode">
              <option value={'CAD'} className="p-2">
                CAD
              </option>
              <option value={'USD'} className="p-2">
                USD
              </option>
            </InputField>

            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button onClick={handleSave} disabled={!isValid}>
                  Save
                </Button>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export { EditOrganizationEvent };
