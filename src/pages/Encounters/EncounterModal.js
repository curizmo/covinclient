import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  Table,
  ModalBody,
  Row,
  Col,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { AiOutlineDownload } from 'react-icons/ai';
import { Code } from 'react-content-loader';
import { Plus } from 'react-feather';

import { ChatMessage, ChatContainer } from 'components/common/Chat';
import { InputField } from 'components/common/InputField';
import { ImageModal } from 'components/common/ImageModal';
import { QuestionsCard } from 'components/common/QuestionCard/QuestionsCard';

import * as appointmentService from 'services/appointment';
import * as fileService from 'services/file';
import * as questionService from 'services/questions';

import { getUser } from 'selectors';

import { FILE_TYPES } from '../../constants';

import config from 'config/config';

import { downloadFileFromBlob } from 'utils/file';
import { getRecommendedAnswers } from 'utils/questions';

import { hideSpinner, showSpinner } from 'actions/spinner';
import MedicineCard from 'components/common/MedicineCard';

const EncounterModal = ({
  isOpen,
  handleCloseEncounterModal,
  appointmentId,
  readOnly = false,
}) => {
  const { t } = useTranslation('common');
  const [note, setNote] = useState('');
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [display, setDisplay] = useState({
    note: true,
  });
  const [displayImageModal, setDisplayImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [search, setSearch] = useState('');
  const [searchMedicine, setSearchMedicine] = useState('');
  const [questions, setQuestions] = useState([]);
  const [medicineResults, setMedicineResults] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);

  const fetchAppointmentNote = async (appointmentId) => {
    try {
      dispatch(showSpinner());
      const response = await appointmentService.fetchAppointmentEncounters(
        appointmentId,
      );

      const note = response.data.data.Note;

      setNote(note);
    } catch (err) {
      // TODO: Handle error
    } finally {
      dispatch(hideSpinner());
    }
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

  const fetchChatMessages = async (appointmentId) => {
    try {
      const response = await appointmentService.getChatMessages(appointmentId);

      let messages = response.data.messages.map((message) => {
        return {
          ...message,
          fileName: message.message.replace(
            `${config.domainURL}/file/encounter/`,
            '',
          ),
        };
      });

      setMessages(messages);
    } catch (err) {
      // TODO: Handle error
    }
  };

  useEffect(() => {
    fetchAppointmentNote(appointmentId);
    fetchChatMessages(appointmentId);
    fetchAppointmentFiles(appointmentId);
  }, [appointmentId]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    if (!e.target.value) {
      setDiagnosis([]);
    }
    delayedHandleNoteChange(e.target.value);
  };

  const delayedHandleNoteChange = useCallback(
    debounce((note) => saveNote(appointmentId, note), 1000),
    [appointmentId],
  );

  const saveNote = async (appointmentId, note) => {
    try {
      const encounter = {
        note,
      };

      await appointmentService.createOrUpdateEncounter(appointmentId, {
        data: { ...encounter },
      });
    } catch (err) {
      // @todo Handle error
    }
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    delayedSearchQuestions(e.target.value);
  };

  const handleSearchMedicineChange = (e) => {
    setSearchMedicine(e.target.value);
    delayedSearchMedicines(e.target.value);
  };

  const searchQuestions = async (search) => {
    try {
      if (!search) {
        setQuestions([]);

        return;
      }
      const response = await questionService.searchQuestions(search);

      let { questions } = response.data;

      questions = getRecommendedAnswers(questions);

      setQuestions(questions);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const searchMedicines = async (search) => {
    try {
      if (!search) {
        setMedicineResults([]);

        return;
      }
      const response = await appointmentService.getMedicines(search);

      setMedicineResults(response.data);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const delayedSearchQuestions = useCallback(
    debounce(searchQuestions, 1000),
    [],
  );

  const delayedSearchMedicines = useCallback(
    debounce(searchMedicines, 1000),
    [],
  );

  const addMedicineToNotes = (medicine) => {
    const newNote = `${note}\n\n[Medicine]:\n${medicine.medDescr} : ${medicine.stdDosesDescr} `;
    setNote(newNote);
    saveNote(appointmentId, newNote);
  };

  const appendAnswerToNote = async (answer) => {
    try {
      const newNote = `${note}\n\nPhoenix's opinion (Dated: ${new Date()
        .toDateString()
        .substring(4)}):\n${answer}`;

      const encounter = {
        note: newNote,
      };

      await appointmentService.createOrUpdateEncounter(appointmentId, {
        data: { ...encounter },
      });

      setQuestions([]);
      setSearch('');
      setNote(newNote);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const getDiagnosis = async () => {
    try {
      setIsDiagnosisLoading(true);
      const response = await appointmentService.getDiagnosis({
        note,
      });

      setDiagnosis(response.data.diagnosis);
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsDiagnosisLoading(false);
    }
  };

  const getPrescriptions = async () => {
    try {
      const response = await appointmentService.getPrescriptions({ note });

      setPrescriptions(response.data.prescriptions);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const getPhoenixOpinion = () => {
    getDiagnosis();
    getPrescriptions();
  };

  const addDiagnosisToNotes = (description) => {
    const newNote = `${note}\n\n[Diagnosis]:\n${description}`;
    setNote(newNote);
  };

  const addPrescriptionToNotes = (description) => {
    const newNote = `${note}\n\n[Prescription]:\n${description}`;
    setNote(newNote);
  };

  return (
    <>
      {displayImageModal && (
        <ImageModal handleClose={closeImageModal} imageUrl={modalImage} />
      )}
      <Modal
        modalClassName="encounter-modal full-size"
        isOpen={isOpen}
        toggle={handleCloseEncounterModal}>
        <ModalHeader toggle={handleCloseEncounterModal}>
          {readOnly ? 'View Encounter' : 'View/Edit Encounter'}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="6" className="h-md-44 h-lg-80">
              <div className="mb-3">
                <Button
                  color="primary"
                  className={`${display.note ? 'active' : ''} mr-2`}
                  onClick={() => setDisplay({ note: true })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setDisplay({ note: true });
                    }
                  }}
                  role="button"
                  tabIndex={0}>
                  Notes
                </Button>
                <Button
                  color="primary"
                  className={`${display.chat ? 'active' : ''} mr-2`}
                  onClick={() => setDisplay({ chat: true })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setDisplay({ chat: true });
                    }
                  }}
                  role="button"
                  tabIndex={0}>
                  Chat
                </Button>
                <Button
                  color="primary"
                  className={`${display.files ? 'active' : ''} mr-2`}
                  onClick={() => setDisplay({ files: true })}>
                  Files
                </Button>
              </div>
              {display.note && (
                <InputField
                  inline={false}
                  type="textarea"
                  value={note}
                  onChange={handleNoteChange}
                  rows="20"
                  disabled={readOnly}
                />
              )}
              {display.chat && (
                <ChatContainer>
                  {messages &&
                    messages.map((message, index) => {
                      return (
                        <ChatMessage
                          key={`${message.message} - ${message.user.email} - ${index}`}
                          message={message}
                          user={user}
                          openImageModal={openImageModal}
                        />
                      );
                    })}
                </ChatContainer>
              )}
              {display.files && (
                <div className="d-flex flex-wrap overflow-auto mh-100">
                  {files &&
                    files.map((file) => {
                      if (file.fileType === FILE_TYPES.IMAGE) {
                        return (
                          <div className="w-25 m-3">
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
                            <span>{file.fileName}</span>
                          </div>
                        );
                      }
                      return (
                        <span
                          className="w-25 m-3"
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
                        </span>
                      );
                    })}
                </div>
              )}
            </Col>
            <Col lg="6" className="mt-lg-4 h-lg-80 h-md-44 overflow-y-scroll">
              {!readOnly && (
                <InputField
                  title={t('sideBar.qna')}
                  inline={false}
                  type="text"
                  value={search}
                  placeholder="Search for questions"
                  onChange={handleSearchChange}
                  rows="10"
                />
              )}
              <InputField
                title={'Order entry'}
                inline={false}
                type="text"
                value={searchMedicine}
                placeholder="Search for medicines"
                onChange={handleSearchMedicineChange}
                rows="10"
              />
              {medicineResults && medicineResults.length ? (
                <MedicineCard
                  medicines={medicineResults}
                  addMedicineToNotes={addMedicineToNotes}
                />
              ) : null}
              {questions && questions.length ? (
                <QuestionsCard
                  questions={questions}
                  appendAnswerToNote={appendAnswerToNote}
                />
              ) : null}
              <Button className="w-100 mt-3" onClick={getPhoenixOpinion}>
                {t('phoenixOpinion')}
              </Button>
              {isDiagnosisLoading && <Code />}
              <Row>
                <Col xs="6">
                  {diagnosis && !isDiagnosisLoading && diagnosis.length ? (
                    <>
                      <div className="d-flex justify-content-between w-50 font-weight-bold my-2">
                        <div>Diagnosis</div>
                      </div>
                      <div className="phoenix-opinion-list">
                        {diagnosis.map((data) => {
                          return (
                            <div
                              key={data.displayName}
                              className="d-flex justify-content-between w-100 mb-2">
                              <div>
                                {`${data.longDescription} (${data.score}%)`}
                                <Table
                                  hover
                                  responsive
                                  className="table-container mt-3">
                                  <thead className="table-header">
                                    <tr>
                                      <th>Medication</th>
                                      <th>Dose</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {data.items.map((subItem) => {
                                      return (
                                        <tr key={subItem.medDescr}>
                                          <td>{subItem.medDescr}</td>
                                          <td>{subItem.stdDosesDescr}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                              <div>
                                <Button
                                  className="btn-sm"
                                  onClick={() =>
                                    addDiagnosisToNotes(data.longDescription)
                                  }>
                                  <Plus />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : null}
                </Col>
                <Col xs="6">
                  {prescriptions && prescriptions.length ? (
                    <>
                      <div className="d-flex justify-content-between font-weight-bold my-2">
                        <div>Prescription</div>
                      </div>
                      <div className="phoenix-opinion-list">
                        {prescriptions.map((data) => {
                          return (
                            <div
                              key={data.prescription}
                              className="d-flex justify-content-between mb-2">
                              <div>{`${data.prescription} (${data.score}%)`}</div>
                              <div>
                                <Button
                                  className="btn-sm"
                                  onClick={() =>
                                    addPrescriptionToNotes(data.prescription)
                                  }>
                                  <Plus />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

EncounterModal.propTypes = {
  isOpen: PropTypes.bool,
  readOnly: PropTypes.bool,
  handleCloseEncounterModal: PropTypes.func,
  appointmentId: PropTypes.string,
};

export { EncounterModal };
