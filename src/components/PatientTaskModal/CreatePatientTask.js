import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  FormGroup,
  Label,
  Badge,
  Form,
  FormFeedback,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose, AiFillCamera } from 'react-icons/ai';

import { InputField } from 'components/common/InputField';
import { Webcam } from 'components/common/Webcam';

import { DAYS_INITIAL_VALUE, RECCURENCE_TYPES } from '../../constants';

import { hideSpinner, showSpinner } from 'actions/spinner';

import { generateFileObjectFromBase64 } from 'utils/file';

import { createPatientTask } from 'services/patientTask';
import * as practitionerService from 'services/practitioner';

import { getUser } from 'selectors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createPatientTaskValidation } from 'validations/createPatientTaskValidation';

const CreatePatientTask = ({ handleClose, patient }) => {
  const [state, setState] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    recurrenceType: '',
    organizationId: '',
  });
  const { register, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(createPatientTaskValidation),
  });
  const [days, setDays] = useState(DAYS_INITIAL_VALUE);
  const [displayDays, setDisplayDays] = useState(false);
  const [files, setFiles] = useState([]);
  const [displayCamera, setDisplayCamera] = useState(false);
  const [recurrenceTypeOptions] = useState([
    {
      label: RECCURENCE_TYPES.daily,
      value: RECCURENCE_TYPES.daily,
    },
    {
      label: RECCURENCE_TYPES.weekly,
      value: RECCURENCE_TYPES.weekly,
    },
  ]);
  const [organizations, setOrganizations] = useState([]);
  const [daysError, setDaysError] = useState('');
  const webcamRef = useRef();
  const fileInputRef = useRef();
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.NTOUserID) {
      fetchOrganizations(user.NTOUserID);
    }
  }, [user.NTOUserID]);

  const fetchOrganizations = async (ntoUserId) => {
    try {
      dispatch(showSpinner());
      const response = await practitionerService.fetchPractitionerOrganizations(
        ntoUserId,
      );

      const organizations = response.data.organizations;
      const selectedOrganization = organizations[0].organizationId;

      setOrganizations(organizations);
      setState({
        ...state,
        organizationId: selectedOrganization,
      });
    } catch (err) {
      // TODO: Handle error.
    } finally {
      dispatch(hideSpinner());
    }
  };

  const handleIsRecurringChange = (e) => {
    const isRecurring = e.target.checked;
    const newState = {
      ...state,
      isRecurring,
      recurrenceType: isRecurring ? RECCURENCE_TYPES.daily : '',
    };

    setState(newState);
    setDays(DAYS_INITIAL_VALUE);
    setDisplayDays(false);
    validateForm(days);
  };

  const handleDaySelect = (e) => {
    const newDays = {
      ...days,
      [e.target.name]: e.target.checked,
    };

    setDays(newDays);
    validateForm(newDays);
  };

  const handleRecurrenceTypeSelect = (e) => {
    const recurrenceType = e.target.value;
    const newState = {
      ...state,
      recurrenceType,
    };
    setState(newState);

    if (recurrenceType === RECCURENCE_TYPES.weekly) {
      setDisplayDays(true);
    } else {
      setDisplayDays(false);
      setDays(DAYS_INITIAL_VALUE);
    }

    validateForm(days);
  };

  const validateForm = (days) => {
    if (isRecurring && recurrenceType === RECCURENCE_TYPES.weekly) {
      const isValid = Object.keys(days)
        .map((key) => {
          return days[key];
        })
        .some((v) => v);

      return isValid;
    }

    return true;
  };

  const onSubmit = async (values) => {
    try {
      const isValid = validateForm(days);

      if (!isValid) {
        setDaysError('Please select a day for which the meeting is recurring.');

        return;
      }

      setDaysError('');

      dispatch(showSpinner());

      const payload = {
        ...state,
        ...values,
        files,
        days:
          state.isRecurring && state.recurrenceType === RECCURENCE_TYPES.weekly
            ? getSelectedDays()
            : '',
        patientId: patient.patientId,
      };

      await createPatientTask(payload);

      handleClose();
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const getSelectedDays = () => {
    let selectedDays = [];

    Object.keys(days).forEach((key) => {
      if (days[key]) {
        selectedDays = [...selectedDays, key];
      }
    });

    return selectedDays.join(',');
  };

  const handleFilesUpload = (e) => {
    const newFiles = [...files, ...e.target.files];
    setFiles(newFiles);
  };

  const deleteFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);

    setFiles(newFiles);
  };

  const handleDisplayCamera = () => {
    setDisplayCamera(true);
  };

  const handleCloseCamera = () => {
    setDisplayCamera(false);
  };

  const handleImageClick = () => {
    const image = webcamRef.current.getScreenshot();
    const fileName = `screenshot-${new Date().getTime()}.png`;
    const fileObject = generateFileObjectFromBase64(image, fileName);

    const newFiles = [...files, fileObject];

    setFiles(newFiles);

    handleCloseCamera();
  };

  const handleFileSelectClick = () => {
    fileInputRef.current.click();
  };

  const { isRecurring, recurrenceType, organizationId } = state;

  return (
    <Modal size="lg" isOpen toggle={handleClose}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Webcam
          isOpen={displayCamera}
          handleClose={handleCloseCamera}
          webcamRef={webcamRef}
          handleImageClick={handleImageClick}
        />
        <ModalHeader>Create task</ModalHeader>
        <ModalBody>
          <InputField
            labelSize={3}
            required
            innerRef={register}
            error={errors?.title?.message}
            title="Title:"
            type="text"
            name="title"
            placeholder="Title"
          />
          <InputField
            labelSize={3}
            innerRef={register}
            name="description"
            title="Description:"
            error={errors?.description?.message}
            required
            type="textarea"
            placeholder="Description"
          />
          <InputField
            labelSize={3}
            title="Start Date:"
            type="date"
            error={errors?.startTime?.message}
            required
            name="startTime"
            innerRef={register}
            placeholder="Start Date"
          />
          <InputField
            labelSize={3}
            required
            name="endTime"
            error={errors?.endTime?.message}
            title="End Date:"
            type="date"
            innerRef={register}
            placeholder="End time"
          />
          <InputField
            labelSize={3}
            title="Organization:"
            required
            innerRef={register}
            type="select"
            value={organizationId}
            name="organizationId">
            {organizations.map((organization) => {
              return (
                <option
                  key={organization.organizationId}
                  value={organization.organizationId}>
                  {organization.organizationName}
                </option>
              );
            })}
          </InputField>
          <InputField
            labelSize={3}
            title="Is Recurring:"
            name="isRecurring"
            checked={isRecurring}
            onChange={handleIsRecurringChange}
            type="checkbox"
          />
          {isRecurring && (
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
          )}
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
              <FormFeedback className="d-flex">{daysError}</FormFeedback>
            </FormGroup>
          )}
          <FormGroup>
            <Label sm={3}>File(s):</Label>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              multiple={true}
              onChange={handleFilesUpload}
            />
            <Button type="button" onClick={handleFileSelectClick}>
              Select file(s)
            </Button>
          </FormGroup>
          <AiFillCamera
            size={32}
            className="cursor-pointer"
            onClick={handleDisplayCamera}
          />

          <div className="d-flex">
            {files.map((file, index) => (
              <div key={`${index} - ${file.name}`}>
                <Badge color="info">{file.name}</Badge>
                <AiOutlineClose
                  className="inline cursor-pointer"
                  onClick={() => deleteFile(index)}
                />
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary">
            Submit
          </Button>
          <Button type="button" color="danger" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export { CreatePatientTask };
