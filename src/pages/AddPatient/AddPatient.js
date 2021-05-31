import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  FormGroup,
  Label,
} from 'reactstrap';
import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';
import { LinkButton } from 'components/common/Button';

import { hideSpinner, showSpinner } from 'actions/spinner';
import * as patientService from 'services/patient';
import { getISODate, currentDate, getErrorMessage, getRandomKey } from 'utils';
import { routes } from 'routers';
import { patientValidation } from 'validations';
import { GENDER_OPTIONS } from '../../constants';
import time from 'assets/images/svg-icons/clock.svg';
import { getDate } from 'global';
import {
  RadioLabel,
  RadioInput,
  OptionName,
  DateAndTime,
  DateAndTimeWrap,
  InfoWrapper,
  TimeImage,
  ViewName,
} from 'global/styles';

const Headings = styled.section`
  padding: 0em 4em;
  width: 100%;
  @media (max-width: 768px) {
    padding: 0em;
  }
`;

const AddPatient = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [serverError, setServerError] = useState('');
  const [checkedGender] = useState('');

  const { register, handleSubmit, errors, getValues } = useForm({
    resolver: yupResolver(patientValidation),
    mode: 'onBlur',
  });
  const values = getValues();

  const disabled = useMemo(() => {
    return !(
      values.firstName &&
      values.phone &&
      Object.keys(errors)?.length < 1
    );
  }, [errors, values]);

  const handleSave = async (patient) => {
    try {
      dispatch(showSpinner());
      await patientService.createPatient(patient);

      history.push(routes.dashboard.path);
    } catch (err) {
      if (err.response.data) {
        setServerError(err.response.data.message);
      }
    } finally {
      dispatch(hideSpinner());
    }
  };

  return (
    <DashboardLayout>
      <Headings>
        <InfoWrapper>
          <ViewName>Add New Patient</ViewName>
          <DateAndTimeWrap>
            <TimeImage src={time} />
            <DateAndTime>{getDate()}</DateAndTime>
          </DateAndTimeWrap>
        </InfoWrapper>
      </Headings>
      <Container>
        <Form onSubmit={handleSubmit(handleSave)}>
          <Row>
            <Col md={{ size: 6 }}>
              <InputField
                title="Cell Phone"
                name="phone"
                required
                error={getErrorMessage(errors, 'phone')}
                innerRef={register}
                defaultValue="+91-"
              />
            </Col>
            <Col md={{ size: 6 }}>
              <InputField
                title="Email"
                name="email"
                type="email"
                innerRef={register}
                placeholder="Enter Patient Email ID"
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 6 }}>
              <InputField
                title="First Name"
                name="firstName"
                required
                innerRef={register}
                error={getErrorMessage(errors, 'firstName')}
                placeholder="Enter Patient Full Name"
              />
            </Col>
            <Col md={{ size: 6 }}>
              <InputField
                title="Last Name"
                name="lastName"
                innerRef={register}
                placeholder="Enter Patient Last Name (Optional)"
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 3 }}>
              <FormGroup check row className="mx-0 pl-0">
                <Label>Gender</Label>
                <div className="d-flex mt-2">
                  {GENDER_OPTIONS.map(({ label, value }) => (
                    <RadioLabel htmlFor={value} key={getRandomKey()}>
                      <RadioInput
                        type="radio"
                        name="gender"
                        value={value}
                        id={value}
                        innerRef={register}
                      />
                      <OptionName checked={checkedGender === value}>
                        {label}
                      </OptionName>
                    </RadioLabel>
                  ))}
                </div>
              </FormGroup>
            </Col>
            <Col md={{ size: 3 }}>
              <InputField
                title="Date of Birth"
                name="birthDate"
                innerRef={register}
                type="date"
                max={getISODate(currentDate())}
                placeholder="Select Date"
              />
            </Col>
            <Col md={{ size: 3 }}>
              <InputField
                title="Height"
                name="height"
                innerRef={register}
                error={getErrorMessage(errors, 'height')}
                placeholder="Enter Height"
                customClass="measurement ft"
              />
            </Col>
            <Col md={{ size: 3 }}>
              <InputField
                title="Weight"
                name="weight"
                innerRef={register}
                placeholder="Enter Weight"
                customClass="measurement kg"
              />
              <span />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputField
                title="Address"
                name="addressOne"
                innerRef={register}
                placeholder="Enter Address"
              />
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 6 }}>
              <InputField
                title="City"
                name="city"
                innerRef={register}
                placeholder="Enter City"
              />
            </Col>
            <Col md={{ size: 4 }}>
              <InputField
                title="State"
                name="state"
                innerRef={register}
                placeholder="Enter State"
              />
            </Col>
            <Col md={{ size: 2 }}>
              <InputField
                title="Postal Code"
                name="zip"
                innerRef={register}
                placeholder="Enter Postal Code"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              {serverError ? <Alert color="danger">{serverError}</Alert> : null}
              <div className="d-flex justify-content-end">
                <LinkButton
                  to={routes.dashboard.path}
                  className="btn-cancel mr-2">
                  Cancel
                </LinkButton>
                <Button className="btn-covin" type="submit" disabled={disabled}>
                  Add Patient
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </DashboardLayout>
  );
};

export default AddPatient;
