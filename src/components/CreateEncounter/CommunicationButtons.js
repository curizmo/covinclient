import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import callIcon from 'assets/images/svg-icons/phone.svg';
import videoIcon from 'assets/images/svg-icons/video.svg';
import { handleCallAppointment } from 'utils';

const CommunicationWrap = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const CallButton = styled.button`
  background-color: #fff;
  border: 1.5px solid #c5cde1;
  box-shadow: 0px 3px 3px rgba(159, 167, 186, 0.2);
  border-radius: 65px;
  height: 2.8125rem;
  width: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.5rem;
  cursor: pointer;
  :hover {
    background: #f2f7fd;
  }
  :disabled {
    background: #eee;
  }
  @media (max-width: 768px) {
    width: 49%;
    margin: 0;
  }
  span {
    display: none;
    @media (max-width: 768px) {
      font-size: 1rem;
      line-height: 1.25rem;
      color: #22335e;
      margin-left: 0.3rem;
      display: flex;
    }
  }
  a {
    display: flex;
    align-items: center;
  }
`;

const CallIcon = styled.img`
  width: 1rem;
  height: 1rem;
  margin-top: ${(props) => props.margin};
`;

export const CommunicationButtons = ({ dispatch, patientId }) => {
  return (
    <CommunicationWrap>
      {/* @toDo add video call functionality */}
      <CallButton disabled type="button">
        <CallIcon src={videoIcon} alt="call" className="m-1" />
        <span>Video Call</span>
      </CallButton>
      <CallButton
        onClick={handleCallAppointment(dispatch, patientId)}
        type="button">
        <a style={{ textDecoration: 'None', color: 'inherit' }} href={'tel:'}>
          <CallIcon src={callIcon} alt="call" className="m-1" />
          <span>Phone Call</span>
        </a>
      </CallButton>
    </CommunicationWrap>
  );
};

CommunicationButtons.propTypes = {
  dispatch: PropTypes.func,
  patientId: PropTypes.string,
};
