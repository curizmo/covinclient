import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import {
  Row,
  Col,
  Button,
  Form,
  Alert,
  FormGroup,
  Label,
  CustomInput,
} from 'reactstrap';

import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';
import { LinkButton } from 'components/common/Button';
import Confirmation from '../AddConfirmation';

import csc from 'third-party/country-state-city';
import { hideSpinner, showSpinner } from 'actions/spinner';
import * as patientService from 'services/patient';
import { getErrorMessage } from 'utils';
import { routes } from 'routers';
import { patientValidation } from 'validations';
import { GENDER_OPTIONS, INDIA_COUNTRY_CODE } from '../../constants';
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
import { SplittedDatePicker } from 'components/common/SplittedDatePicker';

const states = csc.getStatesOfCountry(INDIA_COUNTRY_CODE);

const Headings = styled.section`
  padding: 0 4em;
  width: 100%;
  @media (max-width: 768px) {
    padding: 0;
  }
`;
const Container = styled.section`
  margin: 0 4em;
  padding: 2em 10em;
  background-color: #fff;
  @media (max-width: 768px) {
    padding: 2em;
    margin: 0;
  }
  @media (max-width: 1024px) {
    padding: 4em;
  }
`;

const AddPatient = () => {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState('');
  const [checkedGender] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [citiesList, setCitiesList] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState({
    year: '',
    month: '',
    day: '',
  });
  const [newPatient, setnewPatient] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);
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

  useEffect(() => {
    setCitiesList(
      state
        ? csc.getCitiesOfState(
            INDIA_COUNTRY_CODE,
            csc.getStateIsoCodeByName(state),
          )
        : [],
    );
    setCity('');
  }, [state]);

  const handleSave = async ({ phone, heightFt, heightIn, ...patient }) => {
    try {
      dispatch(showSpinner());
      const year = dateOfBirth.year;
      const month = dateOfBirth.month;
      const day = dateOfBirth.day;
      const birthDate =
        year && month && day
          ? new Date(
              `${year}-${month < 9 ? '0' : ''}${+month + 1}-${
                day < 10 ? '0' : ''
              }${day}`,
            )
          : null;
      const newPatient = {
        ...patient,
        phone: phone.replace(/\(/g, '').replace(/\)/g, ''),
        height: heightFt ? `${heightFt}'${heightIn || 0}"` : '',
        state,
        city,
        gender,
        birthDate,
      };
      setnewPatient(newPatient);
      await patientService.createPatient(newPatient);
      setIsConfirmed(true);
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
        {!isConfirmed ? (
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
                  title="Contact Email"
                  name="email"
                  type="email"
                  innerRef={register}
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
                />
              </Col>
              <Col md={{ size: 6 }}>
                <InputField
                  title="Last Name"
                  name="lastName"
                  innerRef={register}
                />
              </Col>
            </Row>
            <Row className="justify-content-between">
              <Col md={{ size: 3 }}>
                <FormGroup check row className="mx-0 pl-0 form-group">
                  <Label>Gender</Label>
                  <div className="d-flex mt-3 flex-wrap justify-content-between">
                    {GENDER_OPTIONS.map(({ label, value }) => (
                      <RadioLabel
                        htmlFor={value}
                        key={value}
                        onClick={() => setGender(value)}>
                        <RadioInput
                          type="radio"
                          name="gender"
                          value={value}
                          id={value}
                        />
                        <OptionName checked={checkedGender === value}>
                          {label}
                        </OptionName>
                      </RadioLabel>
                    ))}
                  </div>
                </FormGroup>
              </Col>
              <Col md={{ size: 4 }}>
                <Label>Date of Birth</Label>
                <SplittedDatePicker
                  date={dateOfBirth}
                  setDate={setDateOfBirth}
                />
              </Col>
              <Col md={{ size: 2 }}>
                <Label>Height</Label>
                <div className="d-flex">
                  <div className="flex-grow-1 mr-1 w-50">
                    <InputField
                      type="number"
                      name="heightFt"
                      innerRef={register}
                      customClass="measurement ft pr-3"
                      error={getErrorMessage(errors, 'heightFt')}
                      min={0}
                      max={8}
                    />
                  </div>
                  <div className="flex-grow-1 w-50 ml-1">
                    <InputField
                      type="number"
                      name="heightIn"
                      innerRef={register}
                      customClass="measurement in pr-3"
                      error={getErrorMessage(errors, 'heightIn')}
                      min={0}
                      max={11}
                    />
                  </div>
                </div>
              </Col>
              <Col md={{ size: 2 }}>
                <InputField
                  type="number"
                  step="0.01"
                  title="Weight"
                  name="weight"
                  error={getErrorMessage(errors, 'weight')}
                  innerRef={register}
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
                />
              </Col>
            </Row>
            <Row>
              <Col md={{ size: 6 }}>
                <InputField
                  tag={CustomInput}
                  onChange={(e) => setState(e.target.value)}
                  customClass="classic-dropdown"
                  defaultValue=""
                  title="State"
                  type="select"
                  name="state">
                  <option value="" disabled hidden default>
                    {'Select State'}
                  </option>
                  {states.map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </InputField>
              </Col>
              <Col md={{ size: 4 }}>
                <InputField
                  disabled={citiesList.length < 1}
                  tag={CustomInput}
                  customClass="classic-dropdown"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  title="City"
                  type="select"
                  name="city">
                  <option value="" disabled hidden default>
                    {'Select City'}
                  </option>
                  {citiesList.map(({ name }) => (
                    <option
                      key={name}
                      value={name}
                      onClick={() => setCity(name)}>
                      {name}
                    </option>
                  ))}
                </InputField>
              </Col>
              <Col md={{ size: 2 }}>
                <InputField
                  title="Postal Code"
                  name="zip"
                  innerRef={register}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                {serverError ? (
                  <Alert color="danger">{serverError}</Alert>
                ) : null}
                <div className="d-flex justify-content-end">
                  <LinkButton
                    to={routes.dashboard.path}
                    className="btn-cancel mr-2 cancel-add-patient">
                    Cancel
                  </LinkButton>
                  <Button
                    className="btn-covin add-patient"
                    type="submit"
                    disabled={disabled}>
                    Add Patient
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        ) : (
          <Confirmation
            newPatient={newPatient}
            message={'is now added to the patient registry'}
            confirmation={
              'will soon receive a message requesting to record their symptoms and vitals'
            }
            confirmationType={'addPatient'}
          />
        )}
      </Container>
    </DashboardLayout>
  );
};

export default AddPatient;
