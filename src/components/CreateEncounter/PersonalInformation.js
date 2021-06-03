import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';

import { CommunicationButtons } from 'components/CreateEncounter';
import { getFormatedDate, handleCallAppointment } from 'utils';
import {
  GENDER_SHORTHAND,
  PATIENT_CURRENT_STATUS,
  RISK,
  INTAKE_FORM_GROUPS,
} from '../../constants';
import { RadioLabel, RadioInput, OptionName } from 'global/styles';
import arrowIcon from 'assets/images/svg-icons/arrow-left.svg';
import collapseIcon from 'assets/images/svg-icons/showMore.svg';
import expandIcon from 'assets/images/svg-icons/showLess.svg';
import mobileIcon from 'assets/images/svg-icons/icon-phone.svg';

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

const HiddenView = styled.div`
  display: ${(props) => (props.showMore ? 'flex' : 'none')};
  z-index: 5;
  position: absolute;
  background: #fff;
  width: 100%;
  box-shadow: 0 5px 10px -5px rgba(101, 115, 150, 0.1);
  border-radius: 5px;
  padding: 0 3.75rem 0 3.75rem;
  flex-wrap: wrap;
`;

const Status = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.risk === 'High'
      ? '#eb2f2f'
      : props.risk === 'Moderate'
      ? '#e5881b'
      : '#657396'};
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
const ShowLessMore = styled.img`
  cursor: pointer;
  margin-top: 0.4rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const RiskLevelWrap = styled.div`
  display: flex;
  @media (max-width: 768px) {
    margin-bottom: 1.875rem;
  }
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

const extraCss = css`
  display: flex;
  align-items: center;
`;

const Info = styled.div`
  margin-right: 3.125rem;
  padding: 1rem 0;
  width: ${(props) => (props.width ? props.width : '5%')};
  ${(props) => props.extraCss}
`;
const Label = styled.div`
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #22335e;
  opacity: 0.5;
  margin-right: ${(props) => (props.margin ? props.margin : '0')};
`;
const Value = styled.div`
  font-size: 1rem;
  line-height: 1.125rem;
  color: #22335e;
  a {
    display: flex;
    align-items: center;
  }
  img {
    width: 0.9375rem;
    height: 0.9375rem;
    margin-right: 0.5rem;
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

const MobAgeAndGender = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

export const PersonalInformation = ({
  data,
  handleRiskLevelChange,
  setRiskLevel,
  riskLevel,
  onSave,
  dispatch,
}) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const radioMenu = Object.values(RISK);
  const toggleShowMore = () => setIsShowMore((state) => !state);
  const onCall = useCallback(
    () => handleCallAppointment(dispatch, data?.patientId),
    [dispatch, data],
  );

  useEffect(() => {
    setRiskLevel(data?.riskLevel?.toLowerCase());
  }, []);

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
          <ShowLessMore
            src={isShowMore ? expandIcon : collapseIcon}
            onClick={toggleShowMore}
          />
        </PatientNameWrap>
        <MobAgeAndGender>
          <Info extraCss={extraCss} width="auto">
            <Label margin="0.3rem">Gender:</Label>
            <Value>{GENDER_SHORTHAND[data?.gender]}</Value>
          </Info>
          <Info extraCss={extraCss} width="auto">
            <Label margin="0.3rem">Age:</Label>
            <Value>{data?.age || '-'}</Value>
          </Info>
        </MobAgeAndGender>
        <RiskLevelWrap>
          {radioMenu.map((radio, index) => {
            return (
              <RadioLabel htmlFor={radio} key={index}>
                <RadioInput
                  type="radio"
                  name="option"
                  value={radio}
                  id={radio}
                  checked={riskLevel === radio}
                  onChange={() => handleRiskLevelChange(radio)}
                />
                <OptionName checked={riskLevel === radio}>
                  {radio} Risk
                </OptionName>
              </RadioLabel>
            );
          })}
        </RiskLevelWrap>
        <CommunicationButtons onCall={onCall} />
        <Button onClick={onSave}>SAVE AND CLOSE</Button>
      </TopView>
      <HiddenView showMore={isShowMore}>
        <Info>
          <Label>Gender:</Label>
          <Value>{GENDER_SHORTHAND[data?.gender]}</Value>
        </Info>
        <Info>
          <Label>Age:</Label>
          <Value>{data?.age || '-'}</Value>
        </Info>
        <Info>
          <Label>Height:</Label>
          <Value>{data?.height || '-'}</Value>
        </Info>
        <Info>
          <Label>Weight:</Label>
          <Value>{data?.weight || '-'} kg</Value>
        </Info>
        <Info width="12%">
          <Label>Mobile:</Label>
          <Value>
            <button className="transparent-button d-flex p-0" onClick={onCall}>
              <img src={mobileIcon} alt="mobile" /> {data?.phone}
            </button>
          </Value>
        </Info>
        <Info width="12%">
          <Label>Current Status:</Label>
          <Value>{data?.currentStatus ?? PATIENT_CURRENT_STATUS.ACTIVE}</Value>
        </Info>
        <Info width="12%">
          <Label>Address:</Label>
          <Value>{data?.address || '-'}</Value>
        </Info>
        <Info width="12%">
          <Label>Patient Since:</Label>
          <Value>{getFormatedDate(data.createdDate) || '-'}</Value>
        </Info>
        <Info width="12%">
          <Label>Known Allergies:</Label>
          {data?.[INTAKE_FORM_GROUPS.ALLERGY]?.length > 0 ? (
            <>
              <Value>{data?.[INTAKE_FORM_GROUPS.ALLERGY]?.join(', ')}</Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
        <Info width="15%">
          <Label>Pre-Existing Conditions:</Label>
          {data?.[INTAKE_FORM_GROUPS.PRE_EXISTING_CONDITION]?.length > 0 ? (
            <>
              <Value>
                {data?.[INTAKE_FORM_GROUPS.PRE_EXISTING_CONDITION]?.join(', ')}
              </Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
        <Info width="12%">
          <Label>Family History:</Label>
          {data?.familyHistory?.length > 0 ? (
            <>
              <Value>{data.familyHistory.join(', ')}</Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
      </HiddenView>
    </PersonalInfoWrap>
  );
};
