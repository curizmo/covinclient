import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  UncontrolledCollapse,
} from 'reactstrap';

import { AnswerItem } from '../AnswerItem';
import { CardLeftPanel } from '../CardLeftPanel';
import { LikeButton } from '../LikeButton';

// import './styles.css';
import config from '../../config/config';

export const QuestionBoard = (props) => {
  const [open, setOpen] = useState(false);
  const [reportAnswer, setReportAnswer] = useState(null);

  const handleReportAnswer = (answer) => {
    setOpen(true);
    setReportAnswer(answer);
  };

  const reportAnswerFlag = (answer) => {
    return fetch(`${config.domainURL}/answer/report`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: answer.id }),
    })
      .then((response) => response)
      .catch(() => {
        // TODO: Handle error here.
      });
  };

  const handleSubmitReportIssue = async () => {
    await reportAnswerFlag(reportAnswer);
    setOpen(false);
    setReportAnswer(null);
  };

  const close = () => setOpen(false);

  const { results } = props;

  return (
    <>
      {results &&
        results.map((question, i) => {
          if (!question.answers) {
            return null;
          }

          return (
            <Card key={`qna_${i}`} className="shadow-sm mb-3">
              <div id={`qna_question_${i}`} className="cursor-pointer">
                <CardLeftPanel title={question.title} />
              </div>
              <UncontrolledCollapse toggler={`qna_question_${i}`}>
                <CardBody>
                  {question.answers.map((answer, index) => {
                    return (
                      <AnswerItem
                        answer={answer}
                        key={index}
                        question={question}
                        handleReportAnswer={handleReportAnswer}
                        handleClickLike={props.handleClickLike}
                        handleAnswerLike={props.handleAnswerLike}
                      />
                    );
                  })}
                  <LikeButton
                    onLike={() => props.handleClickLike(question.id, i)}
                    likes={question.like || 0}
                  />
                </CardBody>
              </UncontrolledCollapse>
            </Card>
          );
        })}

      <Modal isOpen={open} centered>
        <ModalBody>
          <h5>Are you sure you want to report this answer?</h5>
          <div className="small bg-light p-2">
            {reportAnswer && reportAnswer.text}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={close}>
            No
          </Button>
          <Button onClick={handleSubmitReportIssue} color="success">
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
