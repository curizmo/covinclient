import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { routes } from 'routers';
import { GENDER_SHORTHAND } from '../constants';
const moment = require('moment');

const TitleName = styled.section`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  line-height: 2rem;
  color: #70767f;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    margin-bottom: 0.7rem;
    font-size: 1.7rem;
  }
`;

const ContentWrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 8rem auto;
  @media (max-width: 768px) {
    margin: 2rem 0.4rem;
  }
`;

const ConfirmationWrapper = styled.section`
  box-shadow: rgba(14, 30, 37, 0.12) 2px 2px 16px 2px,
    rgba(14, 30, 37, 0.32) 2px 2px 16px 2px;
  background-color: #fff;
  width: 54%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem;
  margin: 1.5rem auto;
  border-radius: 1rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AddConfirmation = ({ newPatient, message }) => {
  const history = useHistory();

  const userInfo = useMemo(() => {
    let info = [];
    if (GENDER_SHORTHAND[newPatient.gender]) {
      info.push(GENDER_SHORTHAND[newPatient.gender]);
    }
    if (newPatient.birthDate) {
      info.push(`${moment().diff(newPatient.birthDate, 'years', false)} years`);
    }
    return info.join(', ');
  }, [newPatient.gender, newPatient.birthDate]);

  const onBackButtonClick = () => {
    history.push(routes.dashboard.path);
  };

  return (
    <ContentWrapper>
      <TitleName>Confirmation</TitleName>
      <ConfirmationWrapper>
        <div className="patient-name">
          {newPatient.firstName} {newPatient.lastName}
        </div>
        <div className="patient-confirm-info">{userInfo || ''}</div>
        <div className="patient-confirm-info">{newPatient.phone}</div>
        <div className="add-info"> {message}</div>
        <div>
          <Button className="back-button" onClick={onBackButtonClick}>
            BACK TO DASHBOARD
          </Button>
        </div>
      </ConfirmationWrapper>
    </ContentWrapper>
  );
};

export default AddConfirmation;
