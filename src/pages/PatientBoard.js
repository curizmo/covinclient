import React, { Component, createRef } from 'react';
import Pusher from 'pusher-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Button } from 'reactstrap';

import {
  fetchQuestions,
  setLoading,
  searchQuestions,
  resetSearchResult,
  setSearchTerm,
  postQuestion,
  clickLikeQuestion,
  handleAnswerLike,
  handleNewQuestionAnswered,
  changeLanguage,
} from '../actions';

import config from '../config/config';

import { QuestionBoard } from 'components/QuestionBoard';
import BannerLinks from 'components/common/BannerLinks';
import SearchBar from 'components/common/SearchBar';

import { normalizeResults } from 'utils/normalizeResults';
import { getSaveQuestionProps } from 'utils/questions';

import { postQuestionToRay } from 'services/ray';

class PatientBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayNewQuestion: false,
    };
  }

  componentDidMount() {
    this.props.fetchQuestions();

    this.subscribeToNewQuestions();
  }

  subscribeToNewQuestions = () => {
    // @toDo add channel object
    const { key, cluster } = config.pusher;
    const pusher = new Pusher(key, {
      cluster,
      encrypted: true,
    });
    // @toDo add channel object
    pusher.subscribe('channel').bind('answer-question', async (data) => {
      await this.props.handleNewQuestionAnswered(data.question);
      this.setState({ displayNewQuestion: true });
    });
  };

  handleDisplayNewQuestion = () => {
    this.setState({
      displayNewQuestion: false,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  handleAnswerLike = (questionId, answerId) => {
    this.props.handleAnswerLike(questionId, answerId);
    const saveQuestionProps = getSaveQuestionProps(
      this.props.questions,
      questionId,
      answerId,
    );
    postQuestionToRay(...saveQuestionProps);
  };

  handleClickLike = (id, index) => {
    this.props.clickLikeQuestion(id, index);
  };

  handleChangeLanguage = (language) => {
    this.props.changeLanguage(language);
  };

  handleResultSelect = (result) => {
    this.props.searchQuestions(this.props.questions, result.title);
    this.props.resetSearchResult();
  };

  handleSearchChange = (e) => {
    this.props.setLoading(false);
    this.props.setSearchTerm(e.target.value);

    setTimeout(() => {
      if (this.props.searchTerm && this.props.searchTerm.length < 1) {
        this.props.resetSearchResult();
      }
      this.props.searchQuestions(this.props.questions, this.props.searchTerm);
    }, 500);
  };

  handleSubmitNewQuestion = () => {
    this.props.postQuestion(this.props.searchTerm);
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.props.resetSearchResult();
    }
  };

  contextRef = createRef();

  render() {
    return (
      <Container>
        <Row>
          <Col md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
            <div className="d-flex flex-column justify-content-center align-items-stretch">
              <BannerLinks
                buttonLabel={this.props.t(
                  'patientBoard:addQuestion.askADoctor',
                )}
              />
              {this.state.displayNewQuestion && (
                <Button color="primary" onClick={this.handleDisplayNewQuestion}>
                  {this.props.t('patientBoard:answers.seeNew')}
                </Button>
              )}
              <SearchBar
                isLoading={this.props.isLoading}
                results={normalizeResults(this.props.results)}
                value={this.props.searchTerm}
                handleResultSelect={this.handleResultSelect}
                handleSearchChange={this.handleSearchChange}
                handleKeyPress={this.handleKeyPress}
              />
            </div>

            <QuestionBoard
              handleClickLike={this.handleClickLike}
              handleAnswerLike={this.handleAnswerLike}
              results={this.props.results}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.questionBoard,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchQuestions,
      setLoading,
      searchQuestions,
      resetSearchResult,
      setSearchTerm,
      postQuestion,
      clickLikeQuestion,
      handleAnswerLike,
      handleNewQuestionAnswered,
      changeLanguage,
    },
    dispatch,
  );

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(PatientBoard),
);
