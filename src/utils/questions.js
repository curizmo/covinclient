import _ from 'lodash';

export const getQuestions = (questions, searchTerm) => {
  const re = new RegExp(_.escapeRegExp(searchTerm), 'i');
  const isMatch = (q) => re.test(q.title);
  return _.filter(questions, isMatch);
};

export const incrementQuestionLikes = (questions, index) => {
  const newData = [...questions];
  newData[index].like = (questions[index].like || 0) + 1;

  return newData;
};

export const incrementAnswerLikes = (questions, questionId, answerId) => {
  let data = questions.map((question) => {
    if (question.id === questionId) {
      return {
        ...question,
        answers: question.answers.map((answer) => {
          if (answer.id === answerId) {
            return {
              ...answer,
              like: (answer.like || 0) + 1,
            };
          }

          return answer;
        }),
      };
    }

    return question;
  });
  return data;
};

export const decrementAnswerLikes = (questions, questionId, answerId) => {
  let data = questions.map((question) => {
    if (question.id === questionId) {
      return {
        ...question,
        answers: question.answers.map((answer) => {
          if (answer.id === answerId) {
            return {
              ...answer,
              like: (answer.like || 1) - 1,
            };
          }

          return answer;
        }),
      };
    }

    return question;
  });
  return data;
};

export const getRecommendedAnswers = (questions) => {
  return questions.map((question) => {
    const recommendedAnswer = question.answers.find(
      (answer) => answer.recommended === 1,
    );

    const answers = question.answers.map((answer, index) => {
      return {
        ...answer,
        recommended: recommendedAnswer
          ? answer.id === recommendedAnswer.id
          : index === 0,
      };
    });

    return {
      ...question,
      answers,
    };
  });
};

export const getSaveQuestionProps = (questions, questionId, answerId) => {
  let question = questions.find((q) => q.id === questionId);
  let questionText = { question: question.title };
  let answerText = {};
  let correctAnswerIndex = 0;
  question.answers.forEach((answer, i) => {
    answerText[`answer${i}`] = answer.text || '';
    if (answer.id === answerId) {
      correctAnswerIndex = i;
    }
  });
  return [questionText, answerText, correctAnswerIndex];
};
