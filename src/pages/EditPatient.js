import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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

import {
  getISODate,
  currentDate,
  getErrorMessage,
  arrayObjectFixer,
} from '../utils';
import csc from 'third-party/country-state-city';
import { hideSpinner, showSpinner } from 'actions/spinner';
import * as patientService from '../services/patient';
import { GENDER_OPTIONS, INDIA_COUNTRY_CODE } from '../constants';
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
} from 'global/styles';

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
  padding: 4em 10em;
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
  const history = useHistory();
  const [serverError, setServerError] = useState('');
  const [gender, setGender] = useState('');
  const [initialState, setInitialState] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [citiesList, setCitiesList] = useState([]);

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
          birthDate: moment(birthDate).format('YYYY-MM-DD'),
        };
        console.log(output);
        arrayObjectFixer(output).map((data) => setValue(...data));
        setCity(output.city);
        setInitialState(output.state);
        setState(output.state);
        setGender(output.gender);
      }
    } catch (err) {
      // TODO: Handle error
    }
  };

  console.log(gender);
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
      await patientService.updatePatient(patientId, {
        ...patient,
        phone: patient.phone.replace(/\(/g, '').replace(/\)/g, ''),
        state,
        city,
        gender,
        patientId,
      });

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
          <ViewName>Edit Patient</ViewName>
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
                title="Patient Email"
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
              <FormGroup check row className="mx-0 pl-0 form-group">
                <Label>Gender</Label>
                <div className="d-flex mt-2">
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
            </Col>
            <Col md={{ size: 3 }}>
              <InputField
                title="Date of Birth"
                name="birthDate"
                innerRef={register}
                type="date"
                max={getISODate(currentDate())}
                placeholder="dd/mm/yyyy"
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
                  <option key={name} value={name} onClick={() => setCity(name)}>
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
                placeholder="Postal Code"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              {serverError ? <Alert color="danger">{serverError}</Alert> : null}
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
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </DashboardLayout>
  );
};

export default EditPatient;
