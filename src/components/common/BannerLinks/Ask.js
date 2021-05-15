import React from 'react';
import { withTranslation } from 'react-i18next';
import { Jumbotron } from 'reactstrap';

import AskQuestionForm from 'components/common/AskQuestionForm';
import { LinkButton } from 'components/common/Button/LinkButton';
import { routes } from 'routers';

const Ask = (props) => {
  return (
    <Jumbotron className="bg-primary text-white text-center">
      <h1>{props.t('patientBoard:banner.cannotAnswer')}</h1>
      <AskQuestionForm buttonLabel={props.buttonLabel} />
      <LinkButton to={routes.chooseOrganization.path} className="ml-2">
        {props.t('patientBoard:addQuestion.bookAnAppointment')}
      </LinkButton>
    </Jumbotron>
  );
};

export default withTranslation()(Ask);
