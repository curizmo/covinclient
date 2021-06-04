import React from 'react';

import {
  DateText,
  SymptomContainer,
  SymptomsStatus,
  SymptomsText,
} from './styles';

const Symptoms = ({ symptoms }) => {
  return (
    <>
      {symptoms?.map((symptom) => {
        return (
          <SymptomContainer key={symptom.recordedAt}>
            <DateText className="mb-1">{symptom.recordedAt}:</DateText>
            <SymptomsText className="mb-2">{symptom.symptom}</SymptomsText>
            <SymptomsStatus>Status: {symptom.status || '-'}</SymptomsStatus>
          </SymptomContainer>
        );
      })}
    </>
  );
};

export { Symptoms };
