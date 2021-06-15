import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { CommunicationButtons } from 'components/CreateEncounter';
import { handleCallAppointment } from 'utils';
import { RISK, COLOR_CODE } from '../../constants';
import arrowIcon from 'assets/images/svg-icons/arrow-left.svg';

const PersonalInfoWrap = styled.div`
  position: relative;
`;

const TopView = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: baseline;
  }
`;

const Status = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.risk === 'High'
      ? COLOR_CODE.highRisk
      : props.risk === 'Moderate'
      ? COLOR_CODE.moderateRisk
      : props.risk === 'Discharged'
      ? COLOR_CODE.dischargedRisk
      : props.risk === 'Uncertain'
      ? COLOR_CODE.uncertainRisk
      : COLOR_CODE.mildRisk};
  width: 1rem;
  height: 1rem;
  margin-right: 1.25rem;
`;

const PatientNameWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.span`
  font-size: 1.25rem;
  line-height: 1.875rem;
  color: #01518d;
  margin-right: 0.9375rem;
`;

const RiskLevelWrap = styled.div`
  display: flex;
`;

const Button = styled.button`
  background: #22335e;
  border: 1px solid #657396;
  box-sizing: border-box;
  box-shadow: 0px 3px 0px #657396;
  border-radius: 3px;
  width: 205px;
  height: 2.8125rem;
  font-weight: bold;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  letter-spacing: 0.2em;
  color: #ffffff;
  @media (max-width: 768px) {
    display: none;
  }
`;

const BackButton = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    font-size: 1rem;
    line-height: 1.25rem;
    color: #657396;
    margin-bottom: 1.5rem;
    img {
      margin-right: 0.625rem;
      margin-top: 0.1rem;
    }
  }
`;

const Select = styled.select`
  border: none;
  outline: none;
  background: white;

  :focus {
    border: none;
    outline: none;
  }
  :focus-visible {
    border: none;
    outline: none;
  }

  font-size: 16px;
  line-height: 20px;
  color: #657396;
`;

// @toDo add communication buttons
const isShowCommunicationButtons = false;

export const PersonalInformation = ({
  data,
  handleRiskLevelChange,
  setRiskLevel,
  riskLevel,
  onSave,
  dispatch,
}) => {
  const riskOptions = Object.values(RISK);
  const onCall = useCallback(
    () => handleCallAppointment(dispatch, data?.patientId),
    [dispatch, data],
  );

  useEffect(() => {
    setRiskLevel(data?.status);
  }, [data?.status]);

  return (
    <PersonalInfoWrap>
      <TopView>
        <BackButton onClick={onSave}>
          <img src={arrowIcon} alt="arrow" />
          Back
        </BackButton>
        <PatientNameWrap>
          <Status risk={riskLevel} />
          <Name>{data?.fullName}</Name>
          <RiskLevelWrap>
            <Select
              value={riskLevel || ''}
              onChange={handleRiskLevelChange}
              onBlur={handleRiskLevelChange}>
              {riskOptions.map((radio) => {
                return (
                  <option key={radio} value={radio}>
                    {radio}
                  </option>
                );
              })}
            </Select>
          </RiskLevelWrap>
        </PatientNameWrap>
        {isShowCommunicationButtons && <CommunicationButtons onCall={onCall} />}
        <Button onClick={onSave}>SAVE AND CLOSE</Button>
      </TopView>
    </PersonalInfoWrap>
  );
};
