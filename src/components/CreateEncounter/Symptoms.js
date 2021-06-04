import React from 'react';

import { Date, SymptomContainer, SymptomsStatus, SymptomsText } from './styles';

const Symptoms = ({ symptoms }) => {
  return (
    <>
      {symptoms?.map((symptom) => {
        return (
          <SymptomContainer key={symptom.recordedAt}>
            <Date className="mb-1">{symptom.recordedAt}:</Date>
            <SymptomsText className="mb-2">{symptom.symptom}</SymptomsText>
            <SymptomsStatus>Status: {symptom.status || '-'}</SymptomsStatus>
          </SymptomContainer>
        );
      })}
    </>
  );
};

export { Symptoms };
