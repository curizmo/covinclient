import React from 'react';
import { GraphicalRepresentation } from '../GraphicalRepresentation/index';
import styled, { css } from 'styled-components';
import { TabContent, TabPane } from 'reactstrap';

import {
  InitiateCovidScreenWrap,
  NoRecordStyling,
  PendingMsg,
  InitiateCovidScreening,
  ResendWrap,
} from '../../global/styles';
import { getRandomKey } from 'utils';

const PATIENT_DETAILS_TABS = {
  VITALS: 'Vitals',
  SYMPTOMS: 'Symptoms',
  PROGRESS: 'Progress',
};

const vitalsTabMenu = [
  {
    name: PATIENT_DETAILS_TABS.VITALS,
    index: '1',
  },
  {
    name: PATIENT_DETAILS_TABS.SYMPTOMS,
    index: '2',
  },
  {
    name: PATIENT_DETAILS_TABS.PROGRESS,
    index: '3',
  },
];

const TabWrap = styled.div`
  display: flex;
  height: 3.125rem;
  width: 100%;
  @media (max-width: 768px) {
    margin-top: 1.25rem;
  }
`;

const EachTab = styled.div`
  width: 33.33%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.selected ? '#22335E' : '#F2F5F8')};
  color: ${(props) => (props.selected ? '#fff' : '#22335E')};
  cursor: pointer;
`;

const TabName = styled.span`
  font-weight: bold;
  font-size: 0.9375rem;
  line-height: 1.25rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
`;

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
  const [activeTab, setActiveTab] = React.useState(vitalsTabMenu[0].index);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <TabWrap>
        {vitalsTabMenu.map((tab) => {
          const isSelected = activeTab === tab?.index;
          return (
            <EachTab
              key={getRandomKey()}
              onClick={() => toggle(tab?.index)}
              selected={isSelected}>
              <TabName>{tab?.name}</TabName>
            </EachTab>
          );
        })}
      </TabWrap>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
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
                      showAxisX: true,
                      showXAxisFonts: false,
                      axisXLines: true,
                      showAxisY: true,
                      showTooltip: true,

                      // dashedYAxis: true,
                      // showYAxisFonts: false,
                      // yAxisDomainFactor: 2,
                      xScalePaddingOuter: 2,
                      // maxRangeMultiplier: 1.8,
                      yAxisFontSize: 12,
                    }}
                  />
                </div>
              ) : null}
            </div>
          </GraphicalColumn>
        </TabPane>
        <TabPane tabId="2"></TabPane>
      </TabContent>
    </div>
  );
};

export { GraphicalReadings };
