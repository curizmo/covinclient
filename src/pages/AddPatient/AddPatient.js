import React, { useEffect, useMemo, useState } from 'react';
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';
import { LinkButton } from 'components/common/Button';

import csc from 'third-party/country-state-city';
import { hideSpinner, showSpinner } from 'actions/spinner';
import * as patientService from 'services/patient';
import { getISODate, currentDate, getErrorMessage, getRandomKey } from 'utils';
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

const states = csc.getStatesOfCountry(INDIA_COUNTRY_CODE);
const countries = csc.getAllCountriesPhoneCodes();
const phoneCodeIn = csc.getCountryPhoneCode(INDIA_COUNTRY_CODE);

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

  const [isPhoneCodesDropdownOpen, setIsPhoneCodesDropdownOpen] =
    useState(false);
  const [isStatesDropdownOpen, setIsStatesDropdownOpen] = useState(false);
  const [isCitiesDropdownOpen, setIsCitiesDropdownOpen] = useState(false);
  const [phoneCode, setPhoneCode] = useState(phoneCodeIn);
  const [state, setState] = useState({});
  const [city, setCity] = useState({});
  const [citiesList, setCitiesList] = useState([]);
  const [gender, setGender] = useState('');

  const togglePhoneCodesDropdown = () =>
    setIsPhoneCodesDropdownOpen((prevState) => !prevState);
  const toggleStatesDropdown = () =>
    setIsStatesDropdownOpen((prevState) => !prevState);
  const toggleCitiesDropdown = () =>
    setIsCitiesDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    setCitiesList(
      state ? csc.getCitiesOfState(INDIA_COUNTRY_CODE, state.isoCode) : [],
    );
    setCity({});
  }, [state]);

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
      await patientService.createPatient({
        ...patient,
        state: state.name,
        city: city.name,
        phone: `${phoneCode}${patient.phone}`,
        gender,
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
              <Label className="required w-100">Cellphone Number</Label>
              <div className="d-flex">
                <Col md={{ size: 3 }} className="px-0">
                  <Dropdown
                    isOpen={isPhoneCodesDropdownOpen}
                    toggle={togglePhoneCodesDropdown}
                    direction="down"
                    className="classic-dropdown">
                    <DropdownToggle caret className="w-100">
                      {phoneCode || 'Code'}
                    </DropdownToggle>
                    <DropdownMenu>
                      {countries.map((country) => (
                        <DropdownItem
                          key={getRandomKey()}
                          onClick={() => setPhoneCode(country.phone_code)}>
                          {country.phone_code}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col md={{ size: 9 }} className="pr-0">
                  <InputField
                    name="phone"
                    required
                    error={getErrorMessage(errors, 'phone')}
                    innerRef={register}
                    placeholder="Enter Cellphone Number"
                  />
                </Col>
              </div>
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
                    <RadioLabel htmlFor={value} key={getRandomKey()}>
                      <RadioInput
                        type="radio"
                        name="gender"
                        value={value}
                        id={value}
                        onClick={() => setGender(value)}
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
              <Label>State</Label>
              <Dropdown
                isOpen={isStatesDropdownOpen}
                toggle={toggleStatesDropdown}
                direction="down"
                className="classic-dropdown">
                <DropdownToggle caret className="w-100">
                  {state.name || 'Select State'}
                </DropdownToggle>
                <DropdownMenu>
                  {states.map((state) => (
                    <DropdownItem
                      key={getRandomKey()}
                      onClick={() => setState(state)}>
                      {state.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md={{ size: 4 }}>
              <Label>City</Label>
              <Dropdown
                isOpen={isCitiesDropdownOpen}
                toggle={toggleCitiesDropdown}
                direction="down"
                className="classic-dropdown">
                <DropdownToggle
                  caret
                  className="w-100"
                  disabled={citiesList.length < 1}>
                  {city.name || 'Select City'}
                </DropdownToggle>
                <DropdownMenu>
                  {citiesList.map((city) => (
                    <DropdownItem
                      key={getRandomKey()}
                      onClick={() => setCity(city)}>
                      {city.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
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
