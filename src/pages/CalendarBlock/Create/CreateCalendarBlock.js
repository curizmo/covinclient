import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Form,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import { DashboardLayout } from '../../../components/common/Layout';
import { InputField } from '../../../components/common/InputField';

import { useCreateEditCalendarBlock } from '../Hooks/useCreateEditCalendarBlock';

import { createCalendarBlock } from 'services/practitioner';

import { hideSpinner, showSpinner } from 'actions/spinner';

import { RECCURENCE_TYPES } from '../../../constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCalendarBlockValidation } from 'validations/createCalenderBlockValidation';

const CreateCalendarBlock = () => {
  const {
    state,
    recurrenceTypeOptions,

    handleIsRecurringChange,
    handleRecurrenceTypeSelect,
    displayDays,
    handleDaySelect,
    days,
    getSelectedDays,
  } = useCreateEditCalendarBlock();
  const history = useHistory();
  const dispatch = useDispatch();
  const { handleSubmit, register, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(createCalendarBlockValidation),
  });

  const handleSave = async (values) => {
    try {
      dispatch(showSpinner());

      const payload = {
        ...state,
        ...values,
        days:
          isRecurring && recurrenceType === RECCURENCE_TYPES.weekly
            ? getSelectedDays()
            : null,
      };

      await createCalendarBlock(payload);
      history.push('/calendar-block');
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const { isRecurring, recurrenceType } = state;

  return (
    <DashboardLayout>
      <Container>
        <Form onSubmit={handleSubmit(handleSave)}>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <h2 className="mb-5">Add Calendar Block</h2>
              <InputField
                labelSize={3}
                type="date"
                title="Start Date:"
                required
                name="startDate"
                innerRef={register}
                error={errors?.startDate?.message}
              />
              <InputField
                labelSize={3}
                required
                type="date"
                title="End Date:"
                name="endDate"
                innerRef={register}
                error={errors?.endDate?.message}
              />
              <InputField
                labelSize={3}
                type="time"
                required
                title="Start Time:"
                name="startTime"
                innerRef={register}
                error={errors?.startTime?.message}
              />
              <InputField
                labelSize={3}
                type="time"
                required
                title="End Time:"
                name="endTime"
                innerRef={register}
                error={errors?.endTime?.message}
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
                innerRef={register}
              />
              <FormGroup row>
                <Col sm={{ size: 10, offset: 2 }}>
                  <Button type="submit">Save</Button>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Container>
    </DashboardLayout>
  );
};

export default CreateCalendarBlock;
