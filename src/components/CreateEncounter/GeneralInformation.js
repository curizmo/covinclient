import HeadersComponent from 'components/common/HeadersComponent/HeadersComponent';
import React, { useCallback } from 'react';
import { Label } from 'reactstrap';

import styled from 'styled-components/macro';
import { format } from 'date-fns';

import mobileIcon from 'assets/images/svg-icons/icon-phone.svg';
import { GENDER_SHORTHAND } from '../../constants';
import { handleCallAppointment } from 'utils';

const Info = styled.div`
  padding-left: 10px;
  padding-top: 10px;
  font-size: 0.9375rem;
  line-height: 1.25rem;
  color: #22335e;
`;

const Value = styled.div`
  font-size: 0.9375rem;
  line-height: 1.25rem;
  color: #22335e;
  font-weight: 700;
`;

const GeneralInformation = ({ data, dispatch }) => {
  const onCall = useCallback(
    () => handleCallAppointment(dispatch, data?.patientId),
    [dispatch, data],
  );
  return (
    <div>
      <HeadersComponent text={'General'} />
      <Info>
        <Label>DOB:</Label>
        <Value>
          {format(new Date(data.dateOfBirth), 'MMMM dd, yyyy')} | {data.age}
        </Value>
      </Info>
      <Info>
        <Label>Gender:</Label>
        <Value>{GENDER_SHORTHAND[data?.gender]}</Value>
      </Info>
      <Info>
        <Label>Patient ID:</Label>
        <Value>{data.patientId}</Value>
      </Info>
      <Info>
        <Label>Cell Number:</Label>
        <button className="transparent-button d-flex p-0" onClick={onCall}>
          {data?.phone}{' '}
          <img style={{ marginLeft: '10px' }} src={mobileIcon} alt="mobile" />
        </button>
      </Info>
      <Info>
        <Label>Address:</Label>
        <Value>{data.address || '-'}</Value>
      </Info>
      <Info>
        <Label>Medical History:</Label>
        {data['Pre-existing condition']?.length > 0 ? (
          <>
            <Value>{data['Pre-existing condition'].join(', ')}</Value>
          </>
        ) : (
          <Value>-</Value>
        )}
      </Info>
      <Info>
        <Label>Allergies (food):</Label>
        <Value>{data.Allergy?.join(',')}</Value>
      </Info>
      <Info>
        <Label>Allergies (medications):</Label>
        <Value>{data.Allergy?.join(',')}</Value>
      </Info>
      <Info>
        <Label>Current medications:</Label>
        {data.pastPrescriptions?.length > 0 ? (
          <>
            <Value>{data.pastPrescriptions.join(', ')}</Value>
          </>
        ) : (
          <Value>-</Value>
        )}
      </Info>
    </div>
  );
};

export default GeneralInformation;
