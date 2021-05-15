import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Button, CardBody, UncontrolledCollapse } from 'reactstrap';
import PropTypes from 'prop-types';

import { deleteQuestion, fetchQuestions } from '../actions';

import { AnswerItem } from './AnswerItem';
import { CardLeftPanel } from './CardLeftPanel';
import { ErrorFallback } from './common/ErrorFallback';
import { YesNoModal } from './common/Modal/YesNoModal';
import { LikeDislikeButton } from './LikeDislikeButton';

import { postAnswer, editAnswer, deleteAnswer } from '../services/answers';
import './QuestionBoard/styles.css';

export const AnswerForm = ({
  q,
  userToken,
  // profileStatus,
  idx,
  showUnanswered,
  handleAnswerLike = () => {},
  handleAnswerDislike = () => {},
}) => {
  const [newQuestion, setNewQuestion] = useState(q);
  const [newAnswer, setNewAnswer] = useState('');
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // @toDo update verify functionality once BE is ready
  // const [userProfileStatus] = useState(profileStatus);
  const [key, setKey] = useState(idx);

  // @toDo add and use setErrors
  const [error] = useState('');
  const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] =
    useState(false);
  const [questionToDeleteInfo, setQuestionToDeleteInfo] = useState([]);
  const [isQuestionUpdated, setIsQuestionUpdated] = useState(false);
  const textAreaRef = useRef(null);

  useEffect(() => {
    setNewQuestion(q);
    setKey(idx);
    setNewAnswer('');
    setSubmitted(false);
    setAnswers({});
  }, [q, idx]);

  const updateAnswers = async (payload) => {
    let deleteAnswerPromises = [];
    let addAnswerPromises = [];
    let editAnswerPromises = [];
    let editedAnswers = [];

    newQuestion.answers.forEach((answer) => {
      const { isEdited, ...answerData } = answer || {};
      if (isEdited) {
        editedAnswers = [...editedAnswers, answerData];
      }
    });

    if (newAnswer) {
      addAnswerPromises = [
        postAnswer({
          idToken: userToken,
          answer: payload,
        }),
      ];
    }

    editedAnswers.forEach((answer) => {
      if (!answer.text.trim()) {
        const deleteAnswerPromise = deleteAnswer({
          idToken: userToken,
          answer,
        });
        deleteAnswerPromises = [...deleteAnswerPromises, deleteAnswerPromise];
      } else {
        const editAnswerPromise = editAnswer({ idToken: userToken, answer });
        editAnswerPromises = [...editAnswerPromises, editAnswerPromise];
      }
    });

    return Promise.all([
      ...deleteAnswerPromises,
      ...addAnswerPromises,
      ...editAnswerPromises,
    ]);
  };

  const showConfirmDeleteModal = (qId, idx) => {
    setQuestionToDeleteInfo([qId, idx]);
    setIsShowConfirmDeleteModal(true);
  };

  const clearQuestionToDeleteInfo = () => {
    setIsShowConfirmDeleteModal(false);
    setQuestionToDeleteInfo([]);
  };

  const hideConfirmDeleteModal = () => {
    setIsShowConfirmDeleteModal(false);
  };

  const handleDeleteQuestion = () => {
    dispatch(deleteQuestion(...questionToDeleteInfo, showUnanswered));
    setIsShowConfirmDeleteModal(false);
  };

  const handleUpdateAnswers = async () => {
    try {
      const payload = {
        questionId: newQuestion.id,
        text: newAnswer,
      };

      await updateAnswers(payload);
      setIsQuestionUpdated(false);
      setSubmitted(true);
      await fetchQuestions();
      setSubmitted(false);
      setNewAnswer('');
    } catch (err) {
      // TODO: Handle errors properly
    }
  };

  const handleSubmit = async () => {
    if (showUnanswered) {
      const answer = {
        questionId: newQuestion.id,
        text: newAnswer,
      };

      await postAnswer({ idToken: userToken, answer });
      setSubmitted(true);
    } else {
      handleUpdateAnswers();
    }
  };

  const handleUpdatedAnswerChange = (event, ansIdx) => {
    const text = event?.target?.value ?? '';

    setNewQuestion((q) => ({
      ...q,
      answers: q.answers.map((item, index) => {
        if (index === ansIdx) {
          return {
            ...item,
            text,
            isEdited: true,
          };
        } else {
          return item;
        }
      }),
    }));

    setIsQuestionUpdated(true);
  };

  const handleNewAnswerChange = (e) => {
    setNewAnswer(e.target.value);
    setIsQuestionUpdated(!!e.target.value);
  };

  // @toDo update verify functionality once BE is ready
  // const isUserUnverified = userProfileStatus && userProfileStatus === 'level 0';
  const isUserUnverified = false;
  const metaData =
    newQuestion.flagIssue ||
    (true && (
      <span className="report-issue">
        Report Issues: <span> {newQuestion.flagIssue}</span>
      </span>
    ));

  return error ? (
    <ErrorFallback error={error} />
  ) : (
    <div className="shadow-sm mb-3 card w-full" key={`ai_question_${key}`}>
      <div id={`ai_question_${key}`} className="cursor-pointer">
        <CardLeftPanel title={newQuestion.title} metaData={metaData} />
      </div>
      {!submitted && !newQuestion.undeleted && (
        <UncontrolledCollapse toggler={`ai_question_${key}`}>
          <CardBody>
            {!showUnanswered &&
              newQuestion.answers &&
              newQuestion.answers.map((answer, index) => {
                return answer.text ? (
                  <div
                    key={newQuestion.id + index}
                    className="d-flex justify-content-between mb-3">
                    <LikeDislikeButton
                      onLike={() => handleAnswerLike(newQuestion.id, answer.id)}
                      likes={answer.like || 0}
                      onDislike={() =>
                        handleAnswerDislike(newQuestion.id, answer.id)
                      }
                    />
                    <textarea
                      ref={textAreaRef}
                      className="answer-textarea w-100"
                      readOnly={isUserUnverified}
                      value={answer.text}
                      placeholder="Tell us more about it..."
                      onChange={(event) =>
                        handleUpdatedAnswerChange(event, index)
                      }
                    />
                  </div>
                ) : null;
              })}
            <div className="pl-5">
              <textarea
                readOnly={isUserUnverified}
                value={newAnswer}
                className="multiple-answers w-100"
                placeholder="Tell us more about it..."
                onChange={handleNewAnswerChange}
              />
            </div>
            <div className="d-flex justify-content-end my-2">
              <Button
                className="form-buttons green w-2/6"
                disabled={isUserUnverified || !isQuestionUpdated}
                onClick={handleSubmit}>
                Submit
              </Button>
              <Button
                className="form-buttons red w-2/6"
                disabled={isUserUnverified}
                onClick={() => showConfirmDeleteModal(newQuestion.id, key)}>
                Delete
              </Button>
            </div>
          </CardBody>
        </UncontrolledCollapse>
      )}

      {newQuestion.undeleted && (
        <div className="message green">
          <div>Deleted</div>
        </div>
      )}
      {submitted && (
        <div className="message green">
          <div>Thank you!</div>
          <div>
            {answers[`newAnswers${newQuestion.id}`] &&
              answers[`newAnswers${newQuestion.id}`].map((answer, index) => {
                return <AnswerItem answer={answer} key={index} />;
              })}
          </div>
        </div>
      )}
      {isShowConfirmDeleteModal && (
        <YesNoModal
          show={isShowConfirmDeleteModal}
          close={hideConfirmDeleteModal}
          text={{ question: 'Do you really want to delete the question?' }}
          handleYes={handleDeleteQuestion}
          handleNo={clearQuestionToDeleteInfo}
        />
      )}
    </div>
  );
};

AnswerForm.propTypes = {
  q: PropTypes.object,
  userToken: PropTypes.string,
  profileStatus: PropTypes.string,
  idx: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showUnanswered: PropTypes.bool,
  handleAnswerLike: PropTypes.func,
  handleAnswerDislike: PropTypes.func,
};
