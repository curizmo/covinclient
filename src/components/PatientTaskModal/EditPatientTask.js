import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Badge,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import {
  AiOutlineClose,
  AiOutlineDownload,
  AiFillCamera,
} from 'react-icons/ai';

import {
  DAYS_INITIAL_VALUE,
  RECCURENCE_TYPES,
  FILE_TYPES,
} from '../../constants';

import config from 'config/config';

import * as fileService from 'services/file';
import * as organizationService from 'services/organization';
import { updatePatientTask } from 'services/patientTask';

import { downloadFileFromBlob } from 'utils/file';

import { InputField } from 'components/common/InputField';
import { ImageModal } from 'components/common/ImageModal';
import { Webcam } from 'components/common/Webcam';

import { hideSpinner, showSpinner } from 'actions/spinner';

import { generateFileObjectFromBase64 } from 'utils/file';

const EditPatientTask = ({ task, handleClose, fetchTasks }) => {
  const [state, setState] = useState({
    id: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isRecurring: false,
    recurrenceType: '',
    organizationId: '',
  });
  const webcamRef = useRef();
  const fileInputRef = useRef();
  const [organization, setOrganization] = useState({});
  const [displayImageModal, setDisplayImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [days, setDays] = useState(DAYS_INITIAL_VALUE);
  const [displayDays, setDisplayDays] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [files, setFiles] = useState([]);
  const [displayCamera, setDisplayCamera] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
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
  const dispatch = useDispatch();

  useEffect(() => {
    fetchOrganization(task.organizationId);
    setInitialValues(task);
  }, [task]);

  const setInitialValues = (task) => {
    const { days, endDate, startDate, isRecurring, files, recurrenceType } =
      task;

    setState({
      ...task,
      startTime: startDate,
      endTime: endDate,
    });

    const filesValue = files.map((file) => {
      return {
        ...file,
        fileName: file.fileUrl.replace(
          `${config.domainURL}/file/encounter/`,
          '',
        ),
      };
    });

    if (recurrenceType === RECCURENCE_TYPES.weekly) {
      setDisplayDays(true);

      const daysArray = days.split(',');
      let daysObject = {};

      daysArray.forEach((day) => {
        daysObject = {
          ...daysObject,
          [day]: true,
        };
      });
      const daysValue = {
        ...DAYS_INITIAL_VALUE,
        ...daysObject,
      };

      setDays(daysValue);
    } else {
      setDisplayDays(false);
      setDays(DAYS_INITIAL_VALUE);
    }

    setDisplayDays(isRecurring);
    setFiles(filesValue);
  };

  const fetchOrganization = async (organizationId) => {
    try {
      dispatch(showSpinner());
      const response = await organizationService.getOrganizationById(
        organizationId,
      );

      const { organization } = response.data;

      setOrganization(organization);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const handleChange = (e) => {
    const newState = {
      ...state,
      [e.target.name]: e.target.value,
    };

    setState(newState);
    validateForm(newState, days);
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
    validateForm(newState, days);
  };

  const handleDaySelect = (e) => {
    const newDays = {
      ...days,
      [e.target.name]: e.target.checked,
    };

    setDays(newDays);
    validateForm(state, newDays);
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

    validateForm(newState, days);
  };

  const validateForm = (state, days) => {
    const {
      title,
      description,
      startTime,
      endTime,
      isRecurring,
      recurrenceType,
      organizationId,
    } = state;
    let isValid =
      title && description && startTime && endTime && organizationId;

    if (!isValid) {
      setIsValid(false);

      return;
    }

    if (isRecurring && recurrenceType === RECCURENCE_TYPES.weekly) {
      const isValid = Object.keys(days)
        .map((key) => {
          return days[key];
        })
        .some((v) => v);

      setIsValid(isValid);

      return;
    }

    setIsValid(true);
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
    const uploadedFiles = [...newFiles, ...e.target.files];
    setNewFiles(uploadedFiles);
  };

  const deleteNewFile = (index) => {
    const uploadedFiles = newFiles.filter((_, i) => i !== index);

    setNewFiles(uploadedFiles);
  };

  const deleteFile = (index) => {
    const newFilesValue = files.filter((_, i) => i !== index);

    setFiles(newFilesValue);
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

    const uploadedFiles = [...newFiles, fileObject];

    setNewFiles(uploadedFiles);

    handleCloseCamera();
  };

  const handleFileSelectClick = () => {
    fileInputRef.current.click();
  };

  const openImageModal = (imageUrl) => {
    setDisplayImageModal(true);
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setDisplayImageModal(false);
    setModalImage(null);
  };

  const handleFileDownload = async (fileName) => {
    try {
      const response = await fileService.getEncounterFile(fileName);

      downloadFileFromBlob(response.data, fileName);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const handleSubmit = async () => {
    try {
      if (!isValid) {
        return;
      }

      dispatch(showSpinner());

      const payload = {
        ...state,
        files,
        days:
          state.isRecurring && state.recurrenceType === RECCURENCE_TYPES.weekly
            ? getSelectedDays()
            : '',
        newFiles,
        startDate: state.startTime,
        endDate: state.endTime,
      };

      await updatePatientTask(payload, task.id);

      fetchTasks(task.patientId);
      handleClose();
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const {
    title,
    description,
    startTime,
    endTime,
    isRecurring,
    recurrenceType,
    organizationId,
  } = state;

  return (
    <>
      <Webcam
        isOpen={displayCamera}
        handleClose={handleCloseCamera}
        webcamRef={webcamRef}
        handleImageClick={handleImageClick}
      />
      {displayImageModal && (
        <ImageModal handleClose={closeImageModal} imageUrl={modalImage} />
      )}
      <Modal isOpen toggle={handleClose}>
        <ModalHeader>Edit Task</ModalHeader>
        <ModalBody>
          <InputField
            labelSize={3}
            title="Title: *"
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Title"
          />
          <InputField
            labelSize={3}
            name="description"
            title="Description: *"
            type="textarea"
            value={description}
            onChange={handleChange}
            placeholder="Description"
          />
          <InputField
            labelSize={3}
            title="Start date: *"
            type="date"
            name="startTime"
            value={startTime}
            onChange={handleChange}
            placeholder="Start time"
          />
          <InputField
            labelSize={3}
            name="endTime"
            title="End date: *"
            type="date"
            value={endTime}
            onChange={handleChange}
            placeholder="End time"
          />
          <InputField
            labelSize={3}
            title="Organization: *"
            type="select"
            value={organizationId}
            name="organizationId"
            onChange={handleChange}
            onBlur={handleChange}
            disabled>
            <option
              key={organization.organizationId}
              value={organization.organizationId}>
              {organization.organizationName}
            </option>
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
            <Button onClick={handleFileSelectClick}>Select file(s)</Button>
          </FormGroup>
          <AiFillCamera
            size={32}
            className="cursor-pointer"
            onClick={handleDisplayCamera}
          />

          <div className="d-flex flex-wrap">
            {files.map((file, index) => {
              if (file.fileType === FILE_TYPES.IMAGE) {
                return (
                  <div className="w-25 m-3 position-relative">
                    <div
                      role="button"
                      tabIndex="0"
                      onClick={() => openImageModal(file.fileUrl)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          openImageModal(file.fileUrl);
                        }
                      }}>
                      <img
                        className="img-fluid cursor-pointer"
                        key={file.fileUrl}
                        src={file.fileUrl}
                        loading="lazy"
                        alt=""
                      />
                    </div>
                    <AiOutlineClose
                      className="inline cursor-pointer delete-btn"
                      onClick={() => deleteFile(index)}
                    />
                  </div>
                );
              }
              return (
                <div
                  className="w-25 m-3 position-relative"
                  key={file.fileUrl}
                  role="button"
                  tabIndex="0"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleFileDownload(file.fileName);
                    }
                  }}
                  onClick={() => handleFileDownload(file.fileName)}>
                  <AiOutlineDownload />
                  {file.fileName}
                  <AiOutlineClose
                    className="inline cursor-pointer delete-btn"
                    onClick={() => deleteFile(index)}
                  />
                </div>
              );
            })}
          </div>
          <div className="d-flex">
            {newFiles.map((file, index) => (
              <div key={`${index} - ${file.name}`}>
                <Badge color="info">{file.name}</Badge>
                <AiOutlineClose
                  className="inline cursor-pointer"
                  onClick={() => deleteNewFile(index)}
                />
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-small ml-2 btn-success"
            disabled={!isValid}
            onClick={() => handleSubmit(task)}>
            Submit
          </Button>
          <Button
            color="secondary"
            className="btn-small ml-2"
            onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { EditPatientTask };
