import React from 'react';
import { GraphicalRepresentation } from '../GraphicalRepresentation/index';
import styled, { css } from 'styled-components';

import {
  InitiateCovidScreenWrap,
  NoRecordStyling,
  PendingMsg,
  InitiateCovidScreening,
  ResendWrap,
} from '../../global/styles';

const GraphicalColumn = styled.div`
  padding: 0.2rem 1.5rem 1.5rem;
`;

const spacingAroundComponent = css`
  height: 12.5rem;
  background: #f2f7fd;
  padding: 0.5rem;
  padding-bottom: 1rem;
  margin: 0.8rem 0rem 0rem;
`;
const desktopViewLabelsForPatientsWithCurrentStats = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const GraphicalReadings = (props) => {
  const { data } = props;

  return (
    <GraphicalColumn>
      {data?.patientParameterStatus === 'Initiated' && (
        <InitiateCovidScreenWrap>
          <NoRecordStyling>No Record Availaible</NoRecordStyling>
          <InitiateCovidScreening>
            INITIATE COVID SCREENING
          </InitiateCovidScreening>
        </InitiateCovidScreenWrap>
      )}
      {data?.patientParameterStatus === 'Pending' && (
        <InitiateCovidScreenWrap>
          <NoRecordStyling>No Record Availaible</NoRecordStyling>
          <PendingMsg>
            <span>
              Invite has been sent to patient, Awaiting Covid details...
            </span>
          </PendingMsg>
          <ResendWrap>Resend</ResendWrap>
        </InitiateCovidScreenWrap>
      )}
      <div>
        {data && data.vitals ? (
          <div>
            <GraphicalRepresentation
              data={data}
              spacingAroundComponent={spacingAroundComponent}
              desktopViewLabelsForPatientsWithCurrentStats={
                desktopViewLabelsForPatientsWithCurrentStats
              }
              preferenceList={{
                showAxisX: false,
                dashedXaxisBaseLine: true,
                dashedYAxis: true,
                showYAxisFonts: false,
                yAxisDomainFactor: 1.2,
                showTooltip: true,
                xScalePaddingOuter: 5,
                // maxRangeMultiplier: 1.8,
                yAxisFontSize: 5,
              }}
            />
          </div>
        ) : null}
      </div>
    </GraphicalColumn>
  );
};

export { GraphicalReadings };
