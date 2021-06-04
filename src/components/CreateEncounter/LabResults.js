import React from 'react';
import { ImAttachment } from 'react-icons/im';

import { ENTER } from '../../constants';

import { getFile } from 'services/file';

import { getTabIndex } from 'utils';
import { downloadFileFromBlob } from 'utils/file';

import { DateText, SymptomContainer, FileText } from './styles';

const LAB_RESULTS = {
  crp: 'CRP',
  dDimer: 'D-dimer',
  eosinophils: 'Eosinophils',
  esr: 'ESR',
  ferritin: 'Ferritin',
  ldh: 'LDH',
  lymphocytes: 'Lymphocytes',
  neutrophil: 'Neutrophil',
  platelets: 'Platelets',
  wbc: 'WBC',
};

const LabResults = ({ labs }) => {
  const handleFileDownload = async (file) => {
    try {
      const response = await getFile(file.file);

      downloadFileFromBlob(response.data, file.name);
    } catch (err) {
      // TODO: Handle error
    }
  };
  return (
    <>
      {labs?.map((result) => {
        return (
          <SymptomContainer key={result.specimenDrawnDate}>
            <DateText className="mb-1">{result.specimenDrawnDate}:</DateText>
            {Object.keys(LAB_RESULTS).map((key) => {
              if (!result[key]) {
                return null;
              }

              return (
                <div key={key}>
                  {LAB_RESULTS[key]}:{result[key]}
                </div>
              );
            })}
            <div>Note: {result.otherLabResultsInfo || '-'}</div>
            {result?.files?.map((file) => {
              return (
                <div
                  className="mt-2"
                  role="button"
                  tabIndex={getTabIndex()}
                  onClick={() => handleFileDownload(file)}
                  onKeyPress={(e) => {
                    if (e.key === ENTER) {
                      handleFileDownload(file);
                    }
                  }}
                  key={file.name}>
                  <ImAttachment className="mr-1" />
                  <FileText>{file.name}</FileText>
                </div>
              );
            })}
          </SymptomContainer>
        );
      })}
    </>
  );
};

export { LabResults };
