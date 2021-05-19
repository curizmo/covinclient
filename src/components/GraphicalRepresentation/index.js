import React from 'react';
import { CMLine } from 'third-party/senze-graphs/dist';
import styled from 'styled-components';

import { rangeCheck } from 'utils/rangeCheck';
import { scales } from '../../constants';

const DesktopViewPatientVitalFieldName = styled.div`
  text-transform: capitalize;
  font-size: 0.8125rem;
  font-weight: bold;
  color: #404040;
`;

const SpacingAroundComponents = styled.div`
  ${(props) =>
    props.spacingAroundComponent ? props.spacingAroundComponent : ''}
`;

const CurrentStatus = styled.div`
  ${(props) =>
    props.desktopViewLabelsForPatientsWithCurrentStats
      ? props.desktopViewLabelsForPatientsWithCurrentStats
      : ''}
`;

const GraphicalRepresentation = (props) => {
  const {
    data,
    preferenceList,
    spacingAroundComponent,
    desktopViewLabelsForPatientsWithCurrentStats,
  } = props;

  return data?.vitals ? (
    <>
      {Object.entries(data.vitals).map((bodyParams, i) => {
        const colors = rangeCheck(bodyParams);
        const minValueDomainYaxis =
          scales[bodyParams?.[0]]?.['minValueDomainYaxis'];
        const maxValueDomainYaxis =
          scales[bodyParams?.[0]]?.['maxValueDomainYaxis'];

        return (
          <SpacingAroundComponents
            spacingAroundComponent={spacingAroundComponent}
            key={i}>
            <CurrentStatus
              desktopViewLabelsForPatientsWithCurrentStats={
                desktopViewLabelsForPatientsWithCurrentStats
              }>
              <div>
                <DesktopViewPatientVitalFieldName>
                  {bodyParams && bodyParams[0]}
                </DesktopViewPatientVitalFieldName>
              </div>
              <div className="desktop-view-vital-current-info-stat display-flex-direction">
                <div
                  className="desktop-view-vital-current-value"
                  style={{
                    color: `${colors[0]}`,
                  }}>
                  {bodyParams &&
                    bodyParams[1].current.map((item) => item.value).join('-')}
                </div>
                <div
                  style={{
                    color: `${colors[0]}`,
                  }}
                  className="degree">
                  {bodyParams && bodyParams[1].unit === 'F' ? '\u00b0' : ''}
                </div>
                <div
                  className="vital-current-unit"
                  style={{
                    color: `${colors[0]}`,
                  }}>
                  {bodyParams && bodyParams[1].unit}
                </div>
              </div>
            </CurrentStatus>
            <div className="desktop-view-graph-wrp-for-vitals">
              <CMLine
                className="custom-class"
                data={bodyParams[1]}
                preferences={{
                  graphColors: colors,
                  minValueDomainYaxis,
                  maxValueDomainYaxis,
                  showTooltip: false,
                  ...preferenceList,
                }}
              />
            </div>
          </SpacingAroundComponents>
        );
      })}
    </>
  ) : null;
};

export { GraphicalRepresentation };
