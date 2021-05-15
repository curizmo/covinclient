import React, { useEffect } from 'react';
import { Container, Row, Col, Button, FormGroup, Label } from 'reactstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';

import { editCalendarBlock, fetchCalendarBlock } from 'services/practitioner';

import { hideSpinner, showSpinner } from 'actions/spinner';

import { useCreateEditCalendarBlock } from '../Hooks/useCreateEditCalendarBlock';

import { RECCURENCE_TYPES, DAYS_INITIAL_VALUE } from '../../../constants';

const EditCalendarBlock = () => {
  const {
    state,
    recurrenceTypeOptions,
    isValid,
    handleChange,
    handleIsRecurringChange,
    handleRecurrenceTypeSelect,
    setState,
    validateForm,
    displayDays,
    handleDaySelect,
    days,
    getSelectedDays,
    setDisplayDays,
    setDays,
  } = useCreateEditCalendarBlock();
  const history = useHistory();
  const match = useRouteMatch();
  const calendarBlockId = match.params.calendarBlockId;
  const dispatch = useDispatch();

  useEffect(() => {
    getCalendarBlock(calendarBlockId);
  }, [calendarBlockId]);

  const getCalendarBlock = async (calendarBlockId) => {
    try {
      dispatch(showSpinner());
      const response = await fetchCalendarBlock(calendarBlockId);

      const {
        id,
        startTime,
        endTime,
        startDate,
        endDate,
        reason,
        isRecurring,
        recurrenceType,
        days,
      } = response.data.calendarBlock;

      const newState = {
        id,
        startTime,
        endTime,
        startDate,
        endDate,
        reason,
        isRecurring,
        recurrenceType,
      };

      let daysValue = {};

      if (isRecurring && recurrenceType === RECCURENCE_TYPES.weekly) {
        setDisplayDays(true);
        const daysArray = days.split(',');
        let daysObject = {};

        daysArray.forEach((day) => {
          daysObject[day] = true;
        });

        daysValue = {
          ...DAYS_INITIAL_VALUE,
          ...daysObject,
        };
      }

      setState(newState);
      setDays(daysValue);
      validateForm(newState, daysValue);
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

      const payload = {
        ...state,
        days:
          isRecurring && recurrenceType === RECCURENCE_TYPES.weekly
            ? getSelectedDays()
            : null,
      };

      await editCalendarBlock(payload, calendarBlockId);
      history.push('/calendar-block');
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const {
    startTime,
    endTime,
    startDate,
    endDate,
    reason,
    isRecurring,
    recurrenceType,
  } = state;

  return (
    <DashboardLayout>
      <Container>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <h2 className="mb-5">Edit Calendar Block</h2>
            <InputField
              labelSize={3}
              type="date"
              title="Start Date: *"
              name="startDate"
              value={startDate}
              onChange={handleChange}
            />
            <InputField
              labelSize={3}
              type="date"
              title="End Date:"
              name="endDate"
              value={endDate}
              onChange={handleChange}
            />
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
              title="Is Recurring:"
              name="isRecurring"
              checked={isRecurring}
              onChange={handleIsRecurringChange}
              type="checkbox"
            />
            <InputField
              labelSize={3}
              title="Recurrence Type:"
              type="select"
              onBlur={handleRecurrenceTypeSelect}
              onChange={handleRecurrenceTypeSelect}
              placeholder="Choose recurrence type"
              value={recurrenceType}
              disabled={!isRecurring}>
              <option value="" disabled hidden default>
                Please Choose...
              </option>
              {recurrenceTypeOptions.map(({ label, value }) => (
                <option key={label} value={value} className="p-2">
                  {label}
                </option>
              ))}
            </InputField>
            {displayDays && (
              <FormGroup>
                <Label sm={3}>Day:</Label>
                {Object.keys(days).map((key) => {
                  const value = days[key];

                  return (
                    <span className="mr-3" key={key}>
                      <input
                        className="mr-1"
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
            )}
            <InputField
              labelSize={3}
              type="textarea"
              title="Reason:"
              name="reason"
              value={reason}
              onChange={handleChange}
            />
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

export default EditCalendarBlock;
