import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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

import { DashboardLayout } from '../components/common/Layout';
import { InputField } from '../components/common/InputField';
import { LinkButton } from '../components/common/Button';

import { getErrorMessage, arrayObjectFixer } from '../utils';
import csc from 'third-party/country-state-city';
import { hideSpinner, showSpinner } from 'actions/spinner';
import * as patientService from '../services/patient';
import { GENDER_OPTIONS, INDIA_COUNTRY_CODE, RISK } from '../constants';
import { patientValidation } from 'validations';
import { routes } from 'routers';
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
  ScrollContainer,
} from 'global/styles';
import { SplittedDatePicker } from 'components/common/SplittedDatePicker';
import Confirmation from './AddConfirmation';

const moment = require('moment');

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

const EditPatient = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState('');
  const [gender, setGender] = useState('');
  const [initialState, setInitialState] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [citiesList, setCitiesList] = useState([]);
  const [inchHeight, setInchHeight] = useState('');
  const [feetHeight, setFeetHeight] = useState('');
  const [height, setHeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState({
    year: '',
    month: '',
    day: '',
  });
  const [status, setStatus] = useState('');
  const [newPatient, setnewPatient] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  const getPatient = async (patientId) => {
    try {
      const response = await patientService.fetchPatient(patientId);
      if (response.data) {
        const {
          familyName: lastName,
          givenName: firstName,
          address1: addressOne,
          dateOfBirth: birthDate,
          ...outputResponse
        } = response.data;
        const output = {
          ...outputResponse,
          firstName,
          lastName,
          addressOne,
          birthDate: birthDate ? moment(birthDate).format('YYYY-MM-DD') : '',
        };
        const heightInFeet =
          (output.height &&
            output.height.split("'")[0].replace(/[^0-9]/g, '')) ||
          '';
        const heightInInch =
          (output.height &&
            output.height.split("'")[1].replace(/[^0-9]/g, '')) ||
          '';
        arrayObjectFixer(output).map((data) => setValue(...data));
        setCity(output.city);
        setInitialState(output.state);
        setState(output.state);
        setGender(output.gender);
        setStatus(output.status);
        setDateOfBirth({
          year: moment(birthDate).year(),
          month: moment(birthDate).month(),
          day: moment(birthDate).date(),
        });
        setFeetHeight(heightInFeet);
        setInchHeight(heightInInch);
      }
    } catch (err) {
      // TODO: Handle error
    }
  };

  const { register, handleSubmit, errors, getValues, setValue } = useForm({
    resolver: yupResolver(patientValidation),
    mode: 'onBlur',
  });

  useEffect(() => {
    getPatient(patientId);
  }, [patientId]);

  const values = getValues();
  const disabled = useMemo(() => {
    return !(
      values.firstName &&
      values.phone &&
      Object.keys(errors)?.length < 1
    );
  }, [errors, values]);

  useEffect(() => {
    if (feetHeight && inchHeight) {
      setHeight(`${feetHeight}'${inchHeight}"`);
    } else if (feetHeight && !inchHeight) {
      setHeight(`${feetHeight}'`);
    } else {
      setHeight('');
    }
  }, [feetHeight, inchHeight]);

  useEffect(() => {
    setCitiesList(
      state
        ? csc.getCitiesOfState(
            INDIA_COUNTRY_CODE,
            csc.getStateIsoCodeByName(state),
          )
        : [],
    );
    setCity(state === initialState ? city : '');
  }, [state]);

  const handleSave = async (patient) => {
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
        phone: patient.phone.replace(/\(/g, '').replace(/\)/g, ''),
        state,
        city,
        gender,
        birthDate,
        height,
        patientId,
        status,
      };
      setnewPatient(newPatient);
      await patientService.updatePatient(patientId, newPatient);
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
      <ScrollContainer>
        <Headings>
          <InfoWrapper>
            <ViewName>Edit Patient Details</ViewName>
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
                <Col md={{ size: 4 }}>
                  <InputField
                    title="Cell Phone"
                    name="phone"
                    required
                    error={getErrorMessage(errors, 'phone')}
                    innerRef={register}
                    defaultValue="+91-"
                  />
                </Col>
                <Col md={{ size: 5 }}>
                  <InputField
                    title="Contact Email"
                    name="email"
                    type="email"
                    innerRef={register}
                  />
                </Col>
                <Col md={{ size: 3 }}>
                  <InputField
                    tag={CustomInput}
                    onChange={(e) => setStatus(e.target.value)}
                    customClass="classic-dropdown"
                    defaultValue=""
                    title="Status"
                    type="select"
                    name="status"
                    innerRef={register}>
                    <option value="" disabled hidden default>
                      {status || 'Select status'}
                    </option>
                    {Object.keys(RISK).map((key) => (
                      <option key={key} value={RISK[key]}>
                        {RISK[key]}
                      </option>
                    ))}
                  </InputField>
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
                <FormGroup check row className="mx-0  px-3 form-group">
                  <Label>Gender</Label>
                  <div className="d-flex mt-3 flex-wrap">
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
                          checked={gender === value}
                        />
                        <OptionName checked={gender === value}>
                          {label}
                        </OptionName>
                      </RadioLabel>
                    ))}
                  </div>
                </FormGroup>
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
                    <div className="flex-grow-1 w-50 mr-1">
                      <InputField
                        type="number"
                        name="heightFt"
                        innerRef={register}
                        customClass="measurement ft pr-3"
                        value={feetHeight}
                        onChange={(e) => setFeetHeight(e.target.value)}
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
                        value={inchHeight}
                        onChange={(e) => setInchHeight(e.target.value)}
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
                    innerRef={register}
                    error={getErrorMessage(errors, 'weight')}
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
                    name="state"
                    innerRef={register}>
                    <option value="" disabled hidden default>
                      {state || 'Select State'}
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
                    name="city"
                    innerRef={register}>
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
                      to={routes.patients.path}
                      className="btn-cancel mr-2 cancel-add-patient">
                      Cancel
                    </LinkButton>
                    <Button
                      className="btn-covin add-patient"
                      type="submit"
                      disabled={disabled}>
                      Save
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          ) : (
            <Confirmation
              newPatient={newPatient}
              message={'is now saved in the patient registry'}
              confirmationType={'editPatient'}
            />
          )}
        </Container>
      </ScrollContainer>
    </DashboardLayout>
  );
};

export default EditPatient;
