import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';

import * as questionService from 'services/questions';

import { QuestionsCard } from './QuestionsCard';
import { InputField } from 'components/common/InputField';

import { ONE_SECOND_IN_MILLISECONDS } from '../../../constants';

import { getRecommendedAnswers } from 'utils/questions';

const QuestionCardModal = ({
  closeModal,
  appendAnswerToNote = () => {},
  searchTerm = '',
  displayAppendToNote = true,
}) => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [displaySubmitQuestion, setDisplaySubmitQuestion] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (searchTerm) {
      setSearch(searchTerm);
      delayedSearchQuestions(searchTerm);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    delayedSearchQuestions(e.target.value);
  };

  const searchQuestions = async (search) => {
    try {
      if (!search) {
        setQuestions([]);

        return;
      }
      const response = await questionService.searchQuestions(search.trim());

      let { questions } = response.data;

      questions = getRecommendedAnswers(questions);

      setQuestions(questions);
      setDisplaySubmitQuestion(!questions.length);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const delayedSearchQuestions = useCallback(
    debounce(searchQuestions, ONE_SECOND_IN_MILLISECONDS),
    [],
  );

  const handleSubmitQuestion = async () => {
    try {
      await questionService.createQuestion({ title: search });
      closeModal();
    } catch (err) {
      // TODO: Handle error
    }
  };

  return (
    <Modal isOpen toggle={closeModal}>
      <ModalHeader toggle={closeModal}>{t('sideBar.qna')}</ModalHeader>
      <ModalBody>
        {t('sideBar.qna')}
        <InputField
          inline={false}
          type="text"
          value={search}
          placeholder="Search for questions"
          onChange={handleSearchChange}
        />
        {questions && questions.length ? (
          <QuestionsCard
            questions={questions}
            displayAppendToNote={displayAppendToNote}
            appendAnswerToNote={appendAnswerToNote}
          />
        ) : null}
        {displaySubmitQuestion ? (
          <>
            <div>No questions were found. Would you like to Ask Covin?</div>
            <Button type="button" onClick={handleSubmitQuestion}>
              Submit
            </Button>
          </>
        ) : null}
      </ModalBody>
    </Modal>
  );
};

export { QuestionCardModal };
