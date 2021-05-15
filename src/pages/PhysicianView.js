import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';

import '../components/QuestionBoard/styles.css';
import { AnswerForm } from '../components/AnswerForm';

import { fetchUnansweredQuestions, fetchQuestions } from '../actions';

import { getUser, getUnansweredQuestions, getQuestions } from 'selectors';

import { handleAnswerLike, handleAnswerDislike } from 'actions/question';
import { useAuthProvider } from 'hooks/useAuthProvider';
import { getSaveQuestionProps } from 'utils/questions';
import { postQuestionToRay } from 'services/ray';

const PhysicianView = ({ error }) => {
  const { t } = useTranslation('physicianView');
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const unansweredQuestions = useSelector(getUnansweredQuestions);
  const questions = useSelector(getQuestions);

  const { account } = useAuthProvider();
  const profilestatus = useMemo(
    () => account?.profilestatus || user?.profilestatus || '',
    [account, user],
  );
  const [isShowUnanswered, setIsShowUnanswered] = useState(true);

  useEffect(() => {
    dispatch(fetchUnansweredQuestions());
    dispatch(fetchQuestions());
  }, [dispatch]);

  const hideUnansweredQuestions = () => {
    setIsShowUnanswered(false);
  };

  const showUnansweredQuestions = () => {
    setIsShowUnanswered(true);
  };

  const onClickAnswerLike = (questionId, answerId) => {
    dispatch(handleAnswerLike(questionId, answerId));
    const saveQuestionProps = getSaveQuestionProps(
      questions,
      questionId,
      answerId,
    );
    postQuestionToRay(...saveQuestionProps);
  };

  const onClickAnswerDislike = (questionId, answerId) => {
    dispatch(handleAnswerDislike(questionId, answerId));
    const saveQuestionProps = getSaveQuestionProps(
      questions,
      questionId,
      answerId,
    );
    postQuestionToRay(...saveQuestionProps);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <div className="bg-primary text-white text-center jumbotron">
            <div className="sm:w-1/2 md:w-11/12 w-full m-auto">
              <h2 className="mb-3">{`${t('welcome')} ${user.displayName}`}</h2>
            </div>
            <div className="flex-row">
              {user && (
                <Row>
                  <Col sm>
                    <Button
                      className="btn btn-secondary mb-2 mx-2 w-100 sm:w-50"
                      onClick={showUnansweredQuestions}
                      active={isShowUnanswered}>
                      {t('buttons.unansweredQuestions')}
                    </Button>
                  </Col>
                  <Col sm>
                    <Button
                      className="btn btn-secondary mb-2 mx-2 w-100 sm:w-50"
                      onClick={hideUnansweredQuestions}
                      active={!isShowUnanswered}>
                      {t('buttons.answeredQuestions')}
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          </div>
          <div className="physician-view-container">
            <section className="container">
              {error && (
                <div className="message red">
                  <p>{error}</p>
                </div>
              )}
            </section>
            <section className="data" />
            <div className="sm:w-1/2 md:w-11/12 w-full m-auto">
              {isShowUnanswered
                ? !!user &&
                  unansweredQuestions?.map((q, idx) => (
                    <AnswerForm
                      userToken={account && account.accessToken}
                      profileStatus={profilestatus}
                      q={q}
                      key={idx}
                      idx={idx}
                      showUnanswered={isShowUnanswered}
                    />
                  ))
                : questions?.map((q, idx) => (
                    <AnswerForm
                      userToken={account && account.accessToken}
                      profileStatus={profilestatus}
                      q={q}
                      key={idx}
                      idx={idx}
                      showUnanswered={isShowUnanswered}
                      handleAnswerLike={onClickAnswerLike}
                      handleAnswerDislike={onClickAnswerDislike}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PhysicianView.propTypes = {
  error: PropTypes.string,
};

export default PhysicianView;
