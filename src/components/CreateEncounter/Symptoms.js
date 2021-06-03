import React from 'react';

import { SymptomContainer } from './styles';

const Symptoms = ({ symptoms }) => {
  return (
    <>
      {symptoms?.map((symptom) => {
        return (
          <SymptomContainer key={symptom.recordedAt}>
            <div className="mb-1">{symptom.recordedAt}:</div>
            <div>{symptom.symptom}</div>
            <div>Status: {symptom.status || '-'}</div>
          </SymptomContainer>
        );
      })}
    </>
  );
};

export { Symptoms };
