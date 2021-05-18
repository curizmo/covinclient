/*global JitsiMeetExternalAPI */
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { Link, useHistory } from 'react-router-dom';
import { GrAttachment, GrDocument } from 'react-icons/gr';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';

import { useTwilio } from '../hooks/useTwilio';

import { LinkButton } from 'components/common/Button/LinkButton';
import { Chat } from 'components/ExamRoom/Chat';
import { Referral } from 'components/Referral';
import { AppointmentReview } from 'components/ExamRoom/AppointmentReview';
import { FilesModal } from 'components/ExamRoom/FilesModal';
import { ImageModal } from 'components/common/ImageModal';
import { Dial } from 'components/common/Dial';
import { QuestionCardModal } from 'components/common/QuestionCard/QuestionCardModal';
import { CreatePatientTask } from 'components/PatientTaskModal/CreatePatientTask';
import { SpinnerComponent } from 'components/common/SpinnerPortal/Spinner';
import { DiagnosisPrescriptionModal } from 'components/common/DiagnosisPrescriptionModal';

import {
  FaPhone,
  FaAddressBook,
  FaCheck,
  FaSpinner,
  FaArrowLeft,
  FaRegEdit,
} from 'react-icons/fa';

import { MessageSquare } from 'react-feather';

import * as appointmentService from '../services/appointment';
import * as jitsiService from '../services/jitsi';
import { fetchPatientByNtoUserId } from 'services/patient';

import { basedConfig } from '../config';

import { getUser, getAppointment } from '../selectors';

import * as appointmentActions from '../actions/appointment';
import * as twilioActions from 'actions/twilio';

import {
  APPOINTMENT_EVENT_STATUSES,
  FILE_TYPES,
  CALL_METHODS,
} from '../constants';
import { IMAGE_TYPE_REGEX } from 'constants/regex';

import config from 'config/config';

import {
  getISODate,
  getDateWithTimezoneOffset,
  getTimeString,
} from 'utils/dateTime';
import { routes } from 'routers';
import { appendPhoenixsOpinionToNote } from 'utils/encounter';

const TeleHealth = () => {
  const [appointment, setAppointment] = useState({});
  const [notes, setNotes] = useState('');
  const [isAppointmentEnded, setIsAppointmentEnded] = useState(false);
  const [jitsiApi, setJitsiApi] = useState(null);
  const jitsiContainer = useRef(null);
  const user = useSelector(getUser);
  const history = useHistory();
  const location = history.location;
  const currentAppointment = useSelector(getAppointment);
  const [files, setFiles] = useState([]);
  const [displayFilesModal, setDisplayFilesModal] = useState(false);
  const [displayImageModal, setDisplayImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [patient, setPatient] = useState({});
  const [displayAskPhoenixModal, setDisplayAskPhoenixModal] = useState(false);
  const [displayAssignTaskModal, setDisplayAssignTaskModal] = useState(false);
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [
    displayDiagnosisPrescriptionModal,
    setDisplayDiagnosisPrescriptionModal,
  ] = useState(false);

  const dispatch = useDispatch();
  const fileInput = useRef();
  const notesInput = useRef();
  const { hangUp, setupDevice, device, onDigitDialed } = useTwilio();

  const isDisabled =
    Object.keys(device).length === 0 || currentAppointment.hasCallEnded;

  const { t } = useTranslation('common');

  const appointmentsPath = routes.appointments.path;

  const delayedHandleNoteChange = useCallback(
    debounce(
      (notes) => saveNote(appointment.organizationEventBookingId, notes),
      1000,
    ),
    [appointment],
  );

  useEffect(() => {
    if (
      !isAppointmentEnded &&
      currentAppointment &&
      currentAppointment.status !== APPOINTMENT_EVENT_STATUSES.InProgress
    ) {
      history.push('/appointments');
    }
  }, [history, currentAppointment]);

  const saveNote = async (appointmentId, note) => {
    try {
      const encounter = {
        note,
      };
      setIsNoteSaved(true);
      await appointmentService.createOrUpdateEncounter(appointmentId, {
        data: { ...encounter },
      });
    } catch (err) {
      // @todo Handle error
    }
  };

  const handleNoteChange = (e) => {
    setNotes(e.target.value);
    setIsNoteSaved(false);
    setIsNoteLoading(true);
    delayedHandleNoteChange(e.target.value);
  };

  const fetchAppointmentEncounters = async (appointmentId) => {
    const response = await appointmentService.fetchAppointmentEncounters(
      appointmentId,
    );

    const note = response.data.data.Note;

    setNotes(note);
  };

  const fetchAppointmentFiles = async (appointmentId) => {
    try {
      const response = await appointmentService.fetchAppointmentFiles(
        appointmentId,
      );

      const files = response.data.files.map((file) => {
        return {
          ...file,
          fileName: file.fileUrl.replace(
            `${config.domainURL}/file/encounter/`,
            '',
          ),
        };
      });

      setFiles(files);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const handleFilePaste = useCallback(
    async (e) => {
      const data = e.clipboardData || window.clipboardData;
      const file = data.files[0];

      if (!file) {
        return;
      }

      uploadEncounterFiles([file]);
    },
    [files],
  );

  useEffect(() => {
    const current = notesInput.current;

    if (current) {
      current.addEventListener('paste', handleFilePaste);

      return () => current.removeEventListener('paste', handleFilePaste);
    }
  }, [handleFilePaste]);

  useEffect(() => {
    if (appointment.organizationEventBookingId) {
      fetchAppointmentEncounters(appointment.organizationEventBookingId);
      fetchAppointmentFiles(appointment.organizationEventBookingId);
    }
  }, [appointment.organizationEventBookingId]);

  useEffect(() => {
    if (appointment.patientUserId && user.isPractitioner) {
      fetchPatient(appointment.patientUserId);
    }
  }, [appointment.patientUserId, user.isPractitioner]);

  useEffect(() => {
    if (appointment.eventStartTime) {
      setAppointment({
        ...appointment,
        displayStartTime: `${getISODate(
          getDateWithTimezoneOffset(appointment.eventStartTime),
        )}, ${getTimeString(
          getDateWithTimezoneOffset(appointment.eventStartTime),
        )}`,
      });
    }
  }, [appointment.eventStartTime]);

  useEffect(() => {
    if (location.state && location.state.appointment) {
      setAppointment(location.state.appointment);
    }
  }, [location.state]);

  const fetchPatient = async (ntoUserId) => {
    try {
      const response = await fetchPatientByNtoUserId(ntoUserId);

      setPatient(response.data);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const getJWT = async () => {
    const response = await jitsiService.fetchJWT();

    return response.data.jwt;
  };

  const startConference = useCallback(async () => {
    if (appointment.organizationEventBookingId) {
      const jwt = await getJWT();

      try {
        const domain = '8x8.vc';
        const options = {
          roomName: `${basedConfig.jitsi.appId}/careprotocol-${appointment.organizationEventBookingId}`,
          parentNode: jitsiContainer.current,
          jwt,
          interfaceConfigOverwrite: {
            filmStripOnly: false,
            SHOW_JITSI_WATERMARK: false,
            HIDE_INVITE_MORE_HEADER: true,
            DISABLE_FOCUS_INDICATOR: true,
          },
          userInfo: {
            displayName: `${user.FirstName} ${user.LastName}`,
          },
          configOverwrite: {
            startWithVideoMuted: false,
            disableSimulcast: false,
            disableDeepLinking: true,
            disableFocusIndicator: true,
            disableInviteFunctions: true,
            disableThirdPartyRequests: true,
            prejoinPageEnabled: true,
            // Note: This is a hack for hiding the room name of the call.
            // The feature is not built in Jitsi and they've said it's low priority.
            // Might need to send a PR there.
            subject: ' ',
          },
        };

        const api = new JitsiMeetExternalAPI(domain, options);

        setJitsiApi(api);
      } catch (err) {
        // @toDo Handle error
      }
    }
  }, [
    jitsiContainer,
    appointment.organizationEventBookingId,
    user.FirstName,
    user.LastName,
  ]);

  useEffect(() => {
    if (
      currentAppointment &&
      currentAppointment.callMethod === CALL_METHODS.JITSI
    ) {
      // Load the jitsi script
      const script = document.createElement('script');
      script.src = 'https://8x8.vc/external_api.js';
      document.body.appendChild(script);
      // start the call only after the above script finishes loading
      script.onload = () => {
        // verify the JitsiMeetExternalAPI constructor is added to the global..
        if (window.JitsiMeetExternalAPI) {
          startConference();
        } else {
          // TODO: Remove alert and add better error handler.
          alert('Jitsi Meet API script not loaded');
        }
      };
      return () => {
        document.body.removeChild(script);
      };
    } else if (
      currentAppointment &&
      currentAppointment.callMethod === CALL_METHODS.TWILIO
    ) {
      if (
        !currentAppointment.isCallInProgress &&
        !currentAppointment.hasCallEnded
      ) {
        onCall(currentAppointment);
      }
    }
  }, [startConference]);

  const handleEndAppointment = async () => {
    try {
      if (
        currentAppointment.isCallInProgress &&
        appointment.callMethod === CALL_METHODS.TWILIO
      ) {
        onHangup();
      }
      setIsLoading(true);
      await appointmentService.endAppointment({
        user,
        appointment,
      });

      dispatch(appointmentActions.setAppointment({}));

      history.push('/appointments');
    } catch (err) {
      console.error(err);
    }
  };

  const onCall = (currentAppointment) => {
    setupDevice(
      `+${currentAppointment.countryCode}${currentAppointment.phone}`,
    );

    dispatch(
      appointmentActions.setAppointment({
        ...currentAppointment,
        isCallInProgress: true,
        hasCallEnded: false,
        hasAppointmentStarted: true,
      }),
    );
  };

  const onHangup = () => {
    hangUp(device);
    setIsDialOpen(false);
    dispatch(
      appointmentActions.setAppointment({
        ...currentAppointment,
        isCallInProgress: false,
        hasCallEnded: true,
      }),
    );
    dispatch(twilioActions.resetTwilio());
  };

  const handleDialOpen = () => {
    return setIsDialOpen(!isDialOpen);
  };

  const endAppointment = () => {
    setIsAppointmentEnded(true);
    dispatch(appointmentActions.setAppointment({}));

    if (jitsiApi) {
      jitsiApi.dispose();
    }
  };

  const handleFileUpload = (e) => {
    uploadEncounterFiles(e.target.files[0]);
  };

  const onClickFileUpload = () => {
    fileInput.current.click();
  };

  const uploadEncounterFiles = async (file) => {
    try {
      const isFileImage = IMAGE_TYPE_REGEX.test(file.type);
      const fileType = isFileImage ? FILE_TYPES.IMAGE : FILE_TYPES.FILE;

      const response = await appointmentService.uploadEncounterFiles(
        file,
        appointment.organizationEventBookingId,
        fileType,
      );

      setFiles([
        ...files,
        {
          ...response.data.file,
          fileName: response.data.file.fileUrl.replace(
            `${config.domainURL}/file/encounter/`,
            '',
          ),
        },
      ]);

      return;
    } catch (err) {
      // TODO: Handle error
    }
  };

  const deleteAppointmentFile = async (fileId) => {
    try {
      await appointmentService.deleteAppointmentFile(
        appointment.organizationEventBookingId,
        fileId,
      );

      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      // TODO: Handle error
    }
  };

  const openFilesModal = () => {
    setDisplayFilesModal(true);
  };

  const closeFilesModal = () => {
    setDisplayFilesModal(false);
  };

  const openImageModal = (imageUrl) => {
    setDisplayImageModal(true);
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setDisplayImageModal(false);
    setModalImage(null);
  };

  const openAskPhoenixModal = () => {
    setDisplayAskPhoenixModal(true);
  };

  const closeAskPhoenixModal = () => {
    setDisplayAskPhoenixModal(false);
  };

  const openDiagnosisPrescriptionModal = () => {
    setDisplayDiagnosisPrescriptionModal(true);
  };

  const closeDiagnosisPrescriptionModal = () => {
    setDisplayDiagnosisPrescriptionModal(false);
  };

  const appendAnswerToNote = (answer) => {
    try {
      const newNote = appendPhoenixsOpinionToNote(notes, answer);

      setNotes(newNote);
      delayedHandleNoteChange(newNote);
      closeAskPhoenixModal();
    } catch (err) {
      // TODO: Handle error
    }
  };

  const appendToNote = (note) => {
    setNotes(note);
    delayedHandleNoteChange(note);
  };

  const openAssignTaskModal = () => {
    setDisplayAssignTaskModal(true);
  };

  const closeAssignTaskModal = () => {
    setDisplayAssignTaskModal(false);
  };

  return (
    <>
      {isLoading ? <SpinnerComponent /> : null}
      {user.isPractitioner && displayAssignTaskModal && (
        <CreatePatientTask
          handleClose={closeAssignTaskModal}
          patient={patient}
        />
      )}
      {isAppointmentEnded ? (
        user && user.isPractitioner ? (
          <div className="text-center">
            <h2 className="mb-3">The appointment has ended.</h2>
            <LinkButton to="/" color="link">
              Back to home
            </LinkButton>
          </div>
        ) : (
          <AppointmentReview appointment={appointment} />
        )
      ) : (
        <>
          {displayAskPhoenixModal ? (
            <QuestionCardModal
              closeModal={closeAskPhoenixModal}
              appendAnswerToNote={appendAnswerToNote}
            />
          ) : null}
          {displayDiagnosisPrescriptionModal ? (
            <DiagnosisPrescriptionModal
              notes={notes}
              closeModal={closeDiagnosisPrescriptionModal}
              appendToNote={appendToNote}
            />
          ) : null}
          {displayFilesModal && (
            <FilesModal
              files={files}
              handleClose={closeFilesModal}
              deleteFile={deleteAppointmentFile}
              openImageModal={openImageModal}
            />
          )}
          {displayImageModal && (
            <ImageModal handleClose={closeImageModal} imageUrl={modalImage} />
          )}
          <div className="telehealth-container">
            <div className="caller-section-wrapper">
              <div className="call-section">
                <div className="exam-info-titles">
                  <Link
                    to={appointmentsPath}
                    data-for="backToAppointment"
                    data-tip="Back To Appointment">
                    <Button>
                      <FaArrowLeft />
                    </Button>
                  </Link>
                  <ReactTooltip
                    id={'backToAppointment'}
                    place="bottom"
                    effect="float"
                  />
                  {user.isPractitioner ? (
                    <div className="exam-details-container  mb-3">
                      <div className="exam-detail">
                        <span>Patient</span>
                        <span className="font-weight-bold">{`${appointment.patientFirstName}
               ${appointment.patientLastName}`}</span>
                      </div>
                      <div className="exam-detail">
                        <span>Confirmation No</span>
                        <span className="font-weight-bold">
                          {appointment.eventConfirmationNumber}
                        </span>
                      </div>
                      <div className="exam-detail">
                        <span>Start time</span>
                        <span className="font-weight-bold">
                          {appointment.displayStartTime}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="exam-details-container  my-3">
                      <div className="exam-detail">
                        <span>Practitioner:</span>
                        <div className="font-weight-bold">
                          {appointment.practitionerDisplayName}
                        </div>
                      </div>
                      <div className="exam-detail">
                        <span>Confirmation no.:</span>
                        <div className="font-weight-bold">
                          {appointment.eventConfirmationNumber}
                        </div>
                      </div>
                      <div className="exam-detail">
                        <span>Start time:</span>
                        <div className="font-weight-bold">
                          {appointment.displayStartTime}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Row>
                  <Col md={{ size: 10 }}>
                    {currentAppointment &&
                    currentAppointment.callMethod === CALL_METHODS.JITSI ? (
                      <div
                        ref={jitsiContainer}
                        className="embed-responsive embed-responsive-16by9 jitsi-embed bg-dark"></div>
                    ) : (
                      <>
                        <div>
                          <Card
                            style={{ width: '100%', height: '35rem' }}
                            className="phone-call-card">
                            <CardBody className="text-center">
                              <div className="my-5 call-text-wrapper">
                                <span>
                                  <h2 className="font-weight-bold call-text">
                                    <FaAddressBook
                                      className="mx-2"
                                      size="0.8em"
                                    />{' '}
                                    {`${appointment.patientFirstName} ${appointment.patientLastName}`}
                                  </h2>
                                </span>
                                <div className="my-5">
                                  <span>
                                    <h4 className="font-weight-bold call-text">
                                      <FaPhone className="mx-2" size="0.8em" />{' '}
                                      {currentAppointment.phone}
                                    </h4>
                                  </span>
                                </div>
                              </div>
                            </CardBody>
                            <CardBody className="text-center">
                              <div className="call-buttons-wrapper">
                                {currentAppointment.isCallInProgress ? (
                                  <Button
                                    color="danger mx-2"
                                    onClick={onHangup}
                                    disabled={isDisabled}>
                                    Hang Up Call
                                  </Button>
                                ) : (
                                  <Button
                                    color="secondary mx-2"
                                    onClick={() => onCall(currentAppointment)}>
                                    Redial
                                  </Button>
                                )}
                                <Button
                                  color="primary mx-2"
                                  onClick={handleDialOpen}
                                  disabled={isDisabled}>
                                  Dialpad
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </div>

                        {isDialOpen && <Dial onDigitDialed={onDigitDialed} />}
                      </>
                    )}

                    {user.isPractitioner ? (
                      <div className="d-flex justify-content-evenly align-items-center my-5 btn-wrapper">
                        <Button
                          className="mr-2 call-btn-small"
                          onClick={openAssignTaskModal}>
                          Assign Task
                        </Button>
                        <div className="call-btn-small">
                          <Referral
                            appointments={
                              appointment
                                ? [appointment.organizationEventBookingId]
                                : []
                            }
                            patientId={patient.patientId}
                            patientUserId={appointment.patientUserId}
                          />
                        </div>
                        <Button
                          color="danger"
                          onClick={handleEndAppointment}
                          className="call-btn-small">
                          End Appointment
                        </Button>
                      </div>
                    ) : null}
                  </Col>
                </Row>
              </div>
            </div>
            <div className="note-section-wrapper">
              <div className="note-section">
                <Row>
                  <Col md={{ size: 10 }}>
                    {user && user.isPractitioner && (
                      <>
                        <div
                          className={
                            currentAppointment &&
                            currentAppointment.callMethod === CALL_METHODS.JITSI
                              ? 'my-3 position-relative'
                              : 'call-encounter-notes'
                          }>
                          <h6 className="font-weight-bold mb-2">
                            <FaRegEdit className=" mr-2" />
                            Encounter Notes
                          </h6>

                          <textarea
                            ref={notesInput}
                            rows="9"
                            cols="5"
                            onChange={handleNoteChange}
                            className="form-control encounter-text"
                            value={notes}
                          />

                          {isNoteLoading && (
                            <Button
                              color="link"
                              className="position-absolute r-0 b-0 ml-4"
                              disabled={true}>
                              {isNoteSaved ? (
                                <FaCheck className="green" />
                              ) : (
                                <FaSpinner className="spin" />
                              )}
                            </Button>
                          )}
                          <input
                            ref={fileInput}
                            type="file"
                            onChange={handleFileUpload}
                            multiple={false}
                            hidden
                          />
                        </div>
                        <div className="my-3">
                          <div className="note-buttons-container">
                            <div>
                              <Button
                                onClick={onClickFileUpload}
                                className="mb-2 mr-2">
                                <GrAttachment color="#fffff" className="mr-2" />
                                Attach File
                              </Button>
                              <Button
                                disabled={!files.length}
                                onClick={openFilesModal}
                                className="mb-2 mr-2">
                                <GrDocument color="#fffff" className="mr-2" />
                                View Files ({files.length})
                              </Button>
                            </div>
                            <div>
                              <Button
                                className="mr-2 mb-2"
                                onClick={openAskPhoenixModal}>
                                {t('sideBar.qna')}
                              </Button>
                              <Button
                                className="mr-2 mb-2"
                                onClick={openDiagnosisPrescriptionModal}>
                                {t('phoenixOpinion')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </Col>
                  <Col md={{ size: 10 }} className="my-3">
                    {appointment.callMethod === CALL_METHODS.JITSI ? (
                      <>
                        <h6 className="font-weight-bold mb-2">
                          <MessageSquare className=" mr-2" />
                          Chat
                        </h6>
                        <Chat
                          user={user}
                          appointment={appointment}
                          endAppointment={endAppointment}
                          jitsiApi={jitsiApi}
                          openImageModal={openImageModal}
                        />
                      </>
                    ) : null}
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeleHealth;
