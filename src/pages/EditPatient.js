import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import { Container, Row, Col, Button, Form, Alert } from 'reactstrap';
import { DashboardLayout } from '../components/common/Layout';
import { InputField } from '../components/common/InputField';

import {
  getISODate,
  currentDate,
  getErrorMessage,
  arrayObjectFixer,
} from '../utils';
import * as patientService from '../services/patient';
import { GENDER_OPTIONS } from '../constants';
import { patientValidation } from 'validations';
import { hideSpinner, showSpinner } from 'actions/spinner';
import { routes } from 'routers';

const EditPatient = () => {
  const { patientId } = useParams();

  const getPatient = async (patientId) => {
    try {
      const response = await patientService.fetchPatient(patientId);

      if (response.data) {
        const {
          familyName: lastName,
          givenName: firstName,
          ...outputResponse
        } = response.data;
        const output = {
          ...outputResponse,
          firstName,
          lastName,
        };
        arrayObjectFixer(output).map((data) => setValue(...data));
      }
    } catch (err) {
      // TODO: Handle error
    }
  };
  const history = useHistory();

  const { register, handleSubmit, errors, getValues, setValue } = useForm({
    resolver: yupResolver(patientValidation),
    mode: 'onBlur',
  });

  useEffect(() => {
    getPatient(patientId);
  }, [patientId]);
  const values = getValues();
  const dispatch = useDispatch();

  const [serverError, setServerError] = useState('');
  const disabled = useMemo(() => {
    if (!Object.keys(errors).length) {
      return false;
    }
    return true;
  }, [errors, values]);

  const handleSave = async (patientInput) => {
    try {
      dispatch(showSpinner());

      await patientService.updatePatient(patientId, {
        ...patientInput,
        patientId,
      });

      history.push(routes.patients.path);
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
      <Container>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <h2 className="mb-5">Edit Patient</h2>

            <Form onSubmit={handleSubmit(handleSave)}>
              <InputField
                title="First Name:"
                name="firstName"
                required
                innerRef={register}
                error={getErrorMessage(errors, 'firstName')}
              />

              <InputField
                title="Last Name:"
                name="lastName"
                required
                innerRef={register}
                error={getErrorMessage(errors, 'lastName')}
              />

              <InputField
                name="gender"
                innerRef={register}
                title="Gender:"
                type="select"
                placeholder="Choose gender">
                <option value="" disabled defaultValue hidden default>
                  Please Choose...
                </option>

                {GENDER_OPTIONS.map(({ label, value }) => (
                  <option key={label} value={value} className="p-2">
                    {label}
                  </option>
                ))}
              </InputField>

              <InputField
                title="DOB:"
                name="birthDate"
                innerRef={register}
                type="date"
                max={getISODate(currentDate())}
              />

              <InputField
                title="Email:"
                name="email"
                type="email"
                required
                error={getErrorMessage(errors, 'email')}
                innerRef={register}
              />

              <InputField
                title="Phone:"
                name="phone"
                error={getErrorMessage(errors, 'phone')}
                innerRef={register}
              />

              <InputField
                title="Address One:"
                name="addressOne"
                innerRef={register}
              />

              <InputField
                title="Address Two:"
                name="addressTwo"
                innerRef={register}
              />

              <InputField title="City:" name="city" innerRef={register} />

              <InputField title="State:" name="state" innerRef={register} />

              <InputField title="Zip:" name="zip" innerRef={register} />

              <Col sm={{ size: 10, offset: 2 }}>
                {serverError ? (
                  <Alert color="danger">{serverError}</Alert>
                ) : null}
                <Button type="submit" disabled={disabled}>
                  Update
                </Button>
              </Col>
            </Form>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default EditPatient;
