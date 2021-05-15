import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  FormFeedback,
} from 'reactstrap';

import { postQuestion } from '../../../actions';

class AddQuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      value: '',
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { t, dispatch } = this.props;

    if (!this.state.value.trim()) {
      this.setState({
        error: t('patientBoard:addQuestion.questionRequired'),
      });
      return;
    }

    await dispatch(postQuestion(this.state.value));
    this.setState({ value: '', showModal: false });
  };

  handleChange = (e) => this.setState({ value: e.target.value, error: false });

  closeModal = () => {
    this.setState({ showModal: false, error: false });
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  render() {
    const { showModal } = this.state;
    const { t, buttonLabel } = this.props;

    return (
      <>
        <Button onClick={this.openModal}>
          {buttonLabel || t('patientBoard:addQuestion.askAQuestion')}
        </Button>

        <Modal isOpen={showModal} toggle={this.closeModal} centered>
          <ModalHeader toggle={this.closeModal}>
            {t('patientBoard:addQuestion.newQuestion')}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Input
                  type="textarea"
                  rows="6"
                  value={this.state.value}
                  onChange={this.handleChange}
                  invalid={this.state.error}
                />
                <FormFeedback>{this.state.error}</FormFeedback>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.questionBoard,
  };
}

export default withTranslation()(connect(mapStateToProps)(AddQuestionForm));
