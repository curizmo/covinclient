import React from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { routes } from 'routers';

const TitleName = styled.section`
margin: 0;
  font-size: 2rem;
  font-weight: 600;
  line-height: 2rem;
  color: #70767f;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 1.25rem;
    line-height: 1.875rem;`;

const ContentWrapper = styled.section`
  width: 100%;
  heigt: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 8rem auto;
`;

const ConfirmationWrapper = styled.section`
  box-shadow: rgba(14, 30, 37, 0.12) 2px 2px 16px 2px,
    rgba(14, 30, 37, 0.32) 2px 2px 16px 2px;
  background-color: #fff;
  width: 52%;
  heigt: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem;
  margin: 1.5rem auto;
  border-radius: 1rem;
  //   @media (max-width: 768px) {
  //     padding: 2em;
  //     margin: 0;
  //   }
  //   @media (max-width: 1024px) {
  //     padding: 4em;
  //   }
`;

const AddConfirmation = () => {
  const history = useHistory();

  const onBackButtonClick = () => {
    history.push(routes.dashboard.path);
  };

  return (
    <>
      <ContentWrapper>
        <TitleName>Confirmation</TitleName>
        <ConfirmationWrapper>
          <div className="patient-name">Amit Singh</div>
          <div className="patient-confirm-info"> M, 48 years</div>
          <div className="patient-confirm-info">+91-849908992</div>
          <div className="add-info"> is now added to the patient registry</div>
          <div>
            <Button className="back-button" onClick={onBackButtonClick}>
              BACK TO DASHBOARD
            </Button>
          </div>
        </ConfirmationWrapper>
      </ContentWrapper>
    </>
  );
};

export default AddConfirmation;
