import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router';

import { CommunicationButtons } from 'components/CreateEncounter';
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
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: baseline;
  }
`;

const HiddenView = styled.div`
  //   height: ${(props) => (!props.showMore ? '20rem' : '0')};
  display: ${(props) => (!props.showMore ? 'flex' : 'none')};
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
    props.risk === 'high'
      ? '#eb2f2f'
      : props.risk === 'moderate'
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
  input[type='radio'] {
    -webkit-appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    outline: none;
    border: 1px solid #9fa7ba;
    cursor: pointer;
    margin-left: 0;
  }

  input[type='radio']:before {
    content: '';
    display: block;
    width: 60%;
    height: 60%;
    margin: 20% auto;
    border-radius: 50%;
  }

  input[type='radio']:checked:before {
    background: #22335e;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  margin-right: 2rem;
  align-items: center;
  @media (max-width: 768px) {
    margin-right: 0.5rem;
  }
`;
const RadioInput = styled.input`
  margin-right: 0.625rem;
`;

const OptionName = styled.span`
  text-transform: capitalize;
  color: ${(props) => (props.checked ? '#22335E' : '#657396')};
  font-size: 1rem;
  line-height: 1.25rem;
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
  //setRiskLevel,
  //riskLevel,
  dispatch,
}) => {
  const [showMore, setShowMore] = useState(true);
  const [riskLevel, setRiskLevel] = useState('');

  const radioMenu = ['high', 'moderate', 'low'];
  const history = useHistory();
  useEffect(() => {
    setRiskLevel(data?.riskLevel?.toLowerCase());
  }, []);

  const onSaveClick = () => {
    history.goBack();
  };

  return (
    <PersonalInfoWrap>
      <TopView>
        <BackButton onClick={() => onSaveClick()}>
          <img src={arrowIcon} alt="arrrow" />
          Back
        </BackButton>
        <PatientNameWrap>
          <Status risk={riskLevel} />
          <Name>{data?.name}</Name>
          <ShowLessMore
            src={showMore ? collapseIcon : expandIcon}
            onClick={() => setShowMore(!showMore)}
          />
        </PatientNameWrap>
        <MobAgeAndGender>
          <Info extraCss={extraCss} width="auto">
            <Label margin="0.3rem">Gender:</Label>
            <Value>{data?.gender}</Value>
          </Info>
          <Info extraCss={extraCss} width="auto">
            <Label margin="0.3rem">Age:</Label>
            <Value>{data?.age}</Value>
          </Info>
        </MobAgeAndGender>
        <RiskLevelWrap>
          {radioMenu.map((radio, index) => {
            return (
              <RadioLabel for={radio} key={index}>
                <RadioInput
                  type="radio"
                  name="option"
                  value={radio}
                  id={radio}
                  checked={riskLevel === radio}
                  onChange={() => setRiskLevel(radio)}
                />
                <OptionName checked={riskLevel === radio}>
                  {radio} Risk
                </OptionName>
              </RadioLabel>
            );
          })}
        </RiskLevelWrap>
        <CommunicationButtons dispatch={dispatch} patientId={data.patientId} />
        <Button onClick={() => onSaveClick()}>SAVE AND CLOSE</Button>
      </TopView>
      <HiddenView showMore={showMore}>
        <Info>
          <Label>Gender:</Label>
          <Value>{data?.gender}</Value>
        </Info>
        <Info>
          <Label>Age:</Label>
          <Value>{data?.age}</Value>
        </Info>
        <Info>
          <Label>Height:</Label>
          <Value>{data?.height || '-'} cm</Value>
        </Info>
        <Info>
          <Label>Weight:</Label>
          <Value>{data?.weight || '-'} kg</Value>
        </Info>
        <Info width="12%">
          <Label>Mobile:</Label>
          <Value>
            <a
              style={{ textDecoration: 'None', color: 'inherit' }}
              href={`tel:${data?.mob}`}>
              <img src={mobileIcon} alt="mobile" /> {data?.mob}
            </a>
          </Value>
        </Info>
        <Info width="12%">
          <Label>Current Status:</Label>
          <Value>{data?.currentStatus || '-'}</Value>
        </Info>
        <Info width="12%">
          <Label>Address:</Label>
          <Value>{data?.address || '-'}</Value>
        </Info>
        <Info width="12%">
          <Label>Patient Since:</Label>
          <Value>{data?.patientSince || '-'}</Value>
        </Info>
        <Info width="12%">
          <Label>Known Allergies:</Label>
          {data?.knownAllergies?.length > 0 ? (
            <>
              <Value>{data?.knownAllergies?.join(', ')}</Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
        <Info width="15%">
          <Label>Pre-Existing Conditions:</Label>
          {data?.preExisting.length > 0 ? (
            <>
              <Value>{data?.preExisting?.join(', ')}</Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
        <Info width="12%">
          <Label>Family History:</Label>
          {data?.familyHistory.length > 0 ? (
            <>
              <Value>{data?.familyHistory.join(', ')}</Value>
            </>
          ) : (
            <Value>-</Value>
          )}
        </Info>
      </HiddenView>
    </PersonalInfoWrap>
  );
};
