import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { AiOutlineClose, AiFillCamera } from 'react-icons/ai';
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Badge,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import * as patientService from '../services/patient';
import { getOrganizationEvents } from 'services/organizationEvent';
import { getEventStatuses } from 'services/eventStatus';
import { getPaymentStatuses } from 'services/paymentStatus';
import { fetchPractitionerOrganizations } from 'services/practitioner';

import { DashboardLayout } from '../components/common/Layout';
import { InputField } from '../components/common/InputField';
import { Webcam } from 'components/common/Webcam';
import { QuestionCardModal } from 'components/common/QuestionCard/QuestionCardModal';
import { DiagnosisPrescriptionModal } from 'components/common/DiagnosisPrescriptionModal';

import {
  ENCOUNTER_STATUS,
  APPOINTMENT_EVENT_STATUSES,
  paymentStatus,
} from '../constants';

import { getAppointmentDate, getISODate } from 'utils/dateTime';
import { generateFileObjectFromBase64 } from 'utils/file';
import { appendPhoenixsOpinionToNote } from 'utils/encounter';

import { showSpinner, hideSpinner } from 'actions/spinner';

import { getUser } from 'selectors';
import { capitalizeFirstLetter } from 'utils';

const PatientNote = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState('');
  const [patient, setPatient] = useState({});
  const [organization, setOrganization] = useState('');
  const [organizationEvent, setOrganizationEvent] = useState('');
  const [organizationEvents, setOrganizationEvents] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentPaymentStatus, setAppointmentPaymentStatus] = useState('');
  const [files, setFiles] = useState([]);
  const [eventStatus, setEventStatus] = useState('');
  const [displayCamera, setDisplayCamera] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [displayAskPhoenixModal, setDisplayAskPhoenixModal] = useState(false);
  const [
    displayDiagnosisPrescriptionModal,
    setDisplayDiagnosisPrescriptionModal,
  ] = useState(false);
  const webcamRef = useRef();
  const user = useSelector(getUser);
  const { t } = useTranslation('common');
  const dispatch = useDispatch();

  const fetchPatient = async (patientId) => {
    try {
      setIsLoading(true);
      const response = await patientService.fetchPatient(patientId);

      let patient = response.data;

      patient = {
        ...patient,
        gender: capitalizeFirstLetter(patient.gender),
        dateOfBirth: getISODate(patient.dateOfBirth),
      };

      setPatient(patient);
      setIsLoading(false);
    } catch (err) {
      // @todo Handle error.
      setIsLoading(false);
    }
  };

  const fetchOrganizationEvents = async (organizationId) => {
    try {
      const response = await getOrganizationEvents(organizationId);

      const organizationEvents = response.data.organizationEvents;
      setOrganizationEvents(organizationEvents);
      setOrganizationEvent(organizationEvents[0].organizationEventId);
    } catch (err) {
      // TODO: Handler error
    }
  };

  const fetchEventStatuses = async () => {
    try {
      const response = await getEventStatuses();

      const eventStatuses = response.data.eventStatuses;
      const eventStatus = eventStatuses.find(
        (status) =>
          status.eventStatusDesc === APPOINTMENT_EVENT_STATUSES.Completed,
      );

      setEventStatus(eventStatus.eventStatusId);
    } catch (err) {
      // TODO: Handler error
    }
  };

  const fetchPaymentStatuses = async () => {
    try {
      const response = await getPaymentStatuses();

      const paymentStatuses = response.data.paymentStatuses;
      const appointmentPaymentStatus = paymentStatuses.find(
        (status) => status.paymentStatusDesc === paymentStatus.paid,
      );

      setAppointmentPaymentStatus(appointmentPaymentStatus.paymentStatusId);
    } catch (err) {
      // TODO: Handler error
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetchPractitionerOrganizations(user.NTOUserID);
      const organizations = response.data.organizations;

      setOrganizations(organizations);
      setOrganization(organizations[0]);
      fetchOrganizationEvents(organizations[0].organizationId);
    } catch (err) {
      // TODO: Handle error
    }
  };

  useEffect(() => {
    const today = getAppointmentDate(new Date(), 'yyyy-mm-dd');

    setAppointmentDate(today);
    fetchEventStatuses();
    fetchPaymentStatuses();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const patientId = match.params.patientId;

    fetchPatient(patientId);
  }, [match.params.patientId]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setAppointmentDate(date);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(showSpinner());

      const encounter = {
        patientId: patient.patientId,
        patientName: `${patient.givenName} ${patient.familyName}`,
        note,
        startTime: appointmentDate,
        endTime: appointmentDate,
        status: ENCOUNTER_STATUS.finished,
        eventStatus,
        paymentStatus: appointmentPaymentStatus,
        organizationEvent,
        files,
      };

      await patientService.createEncounter(encounter);

      history.goBack();
    } catch (err) {
      // @todo Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  const handleOrganizationEventChange = (e) => {
    setOrganizationEvent(e.target.value);
  };

  const handleOrganizationChange = (e) => {
    const organizationId = e.target.value;

    setOrganization(organizationId);
    fetchOrganizationEvents(organizationId);
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

  const openAskPhoenixModal = () => {
    setDisplayAskPhoenixModal(true);
  };

  const closeAskPhoenixModal = () => {
    setDisplayAskPhoenixModal(false);
  };

  const appendAnswerToNote = (answer) => {
    try {
      const newNote = appendPhoenixsOpinionToNote(note, answer);

      setNote(newNote);
      closeAskPhoenixModal();
    } catch (err) {
      // TODO: Handle error
    }
  };

  const openDiagnosisPrescriptionModal = () => {
    setDisplayDiagnosisPrescriptionModal(true);
  };

  const closeDiagnosisPrescriptionModal = () => {
    setDisplayDiagnosisPrescriptionModal(false);
  };

  const appendToNote = (note) => {
    setNote(note);
  };

  return (
    <DashboardLayout>
      {displayDiagnosisPrescriptionModal ? (
        <DiagnosisPrescriptionModal
          notes={note}
          closeModal={closeDiagnosisPrescriptionModal}
          appendToNote={appendToNote}
        />
      ) : null}
      <Webcam
        isOpen={displayCamera}
        handleClose={handleCloseCamera}
        webcamRef={webcamRef}
        handleImageClick={handleImageClick}
      />
      <Container>
        {displayAskPhoenixModal ? (
          <QuestionCardModal
            closeModal={closeAskPhoenixModal}
            appendAnswerToNote={appendAnswerToNote}
          />
        ) : null}
        <Row>
          <Col md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
            <h2 className="mb-4">Add Encounter</h2>
            {!isLoading && (
              <Form>
                <p className="mb-3 h5">
                  <Link
                    className="patient-link"
                    to={`/patients/${patient.patientId}/encounters`}
                    target="_blank">
                    {`${patient.givenName} ${patient.familyName}`}
                  </Link>
                  {` , ${patient.gender}, ${patient.dateOfBirth}`}
                </p>
                <InputField
                  labelSize={3}
                  title="Appointment Date:"
                  className="border outline-none"
                  type="date"
                  required
                  onChange={handleDateChange}
                  value={appointmentDate}
                />
                <InputField
                  required
                  labelSize={3}
                  title="Organization:"
                  type="select"
                  value={organization}
                  name="organization"
                  onChange={handleOrganizationChange}
                  onBlur={handleOrganizationChange}>
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
                  title="Organization Event:"
                  type="select"
                  value={organizationEvent}
                  name="organizationEvent"
                  onChange={handleOrganizationEventChange}
                  onBlur={handleOrganizationEventChange}>
                  {organizationEvents.map((type) => {
                    return (
                      <option
                        key={type.organizationEventName}
                        value={type.organizationEventId}>
                        {type.organizationEventName}
                      </option>
                    );
                  })}
                </InputField>
                <InputField
                  customClass="note-field"
                  placeholder="Enter Notes"
                  type="textarea"
                  onChange={handleNoteChange}
                  value={note}
                />
                <div className="mb-3">
                  <Button onClick={openAskPhoenixModal}>
                    {t('sideBar.qna')}
                  </Button>
                  <Button
                    className="ml-2"
                    onClick={openDiagnosisPrescriptionModal}>
                    {t('phoenixOpinion')}
                  </Button>
                </div>
                <div className="d-flex">
                  <div className="mr-5">Add Files</div>
                  <InputField
                    labelSize={3}
                    title="Choose Files"
                    type="file"
                    name="Add Files"
                    onChange={handleFilesUpload}
                    customClass="d-none"
                    inline={false}
                    className="w-full opacity-0 text-transparent h-full absolute inset-0"
                  />
                </div>

                <AiFillCamera
                  size={32}
                  className="cursor-pointer"
                  onClick={handleDisplayCamera}
                />
                <div className="my-4">Click on Icon to take picture(s)</div>

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
                <FormGroup row>
                  <Col sm={{ size: 9, offset: 3 }}>
                    <Button onClick={handleSave}>Submit</Button>
                  </Col>
                </FormGroup>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default PatientNote;
