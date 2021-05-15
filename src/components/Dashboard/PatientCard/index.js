import React from 'react';
import styled from 'styled-components';
import './index.css';
import rangeCheck from '../../../utils/rangeCheck';
import { CMLine } from '../../../third-party/senze-graphs/dist';
import { useHistory } from 'react-router';
import mobileIcon from '../../../assets/images/icon_mobile.png';

const State = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.selectedState === 'High'
      ? '#eb2f2f'
      : props.selectedState === 'Mild'
      ? '#657396'
      : '#e5881b'};
  width: 1rem;
  height: 1rem;
`;
const PatientName = styled.div`
  padding-left: 0.75rem;
  font-size: 1.5rem;
  color: #01518d;
  cursor: pointer;
`;

const FieldName = styled.div`
  color: #657396;
  img {
    margin-right: 0.625rem;
  }
`;
const FieldValue = styled.div`
  margin-right: 1.5rem;
  color: #657396;
  font-weight: 700;
`;
const FieldValueSpecific = styled.div`
  color: #657396;
  font-weight: 700;
`;

const PatientGeneralInfo = styled.div`
  display: flex;
  flex-direction: row;
`;
const PatientGeneralWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25rem 0rem;
  row-gap: 0.9375rem;
  font-size: 0.875rem;
`;

const PatientStatusWrp = styled.div`
  display: flex;
  align-items: center;
`;
const PatientVitalFieldName = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #404040;
`;

// Patient information at a glace
const PatientCard = (props) => {
  const { patient } = props;
  const history = useHistory();
  const onPatientNameClick = (name) => {
    const val = name.replace(/ /g, '_').toLowerCase();
    history.push({ pathname: `/patients/${val}`, state: {} });
  };
  return (
    <div className="patient-info">
      {/*patient name & state */}
      <PatientStatusWrp>
        <State selectedState={patient.status} />
        <PatientName onClick={() => onPatientNameClick(patient?.fullName)}>
          {patient?.fullName}
        </PatientName>
      </PatientStatusWrp>
      {/* patient info */}
      <PatientGeneralWrapper>
        {patient?.phone ? (
          <PatientGeneralInfo>
            <FieldName>
              <img src={mobileIcon} alt="mobile" />
            </FieldName>
            <FieldValue>
              <a
                style={{ textDecoration: 'None', color: 'inherit' }}
                href={`tel:${patient.phone}`}>
                {patient.phone}
              </a>
            </FieldValue>
          </PatientGeneralInfo>
        ) : null}
        {patient?.gender ? (
          <PatientGeneralInfo>
            <FieldName>Gender:</FieldName>
            &nbsp;<FieldValue>{patient.gender}</FieldValue>
          </PatientGeneralInfo>
        ) : null}
        {patient?.age ? (
          <PatientGeneralInfo>
            <FieldName>Age:</FieldName>
            &nbsp;<FieldValue>{patient.age}</FieldValue>
          </PatientGeneralInfo>
        ) : null}
        {patient && patient.preExisting && (
          <PatientGeneralInfo>
            <FieldName>Pre-Existing:</FieldName>
            &nbsp;
            {patient?.preExisting?.length > 0 ? (
              <>
                <FieldValueSpecific>
                  {patient?.preExisting?.join(', ')}
                </FieldValueSpecific>
              </>
            ) : (
              <FieldValueSpecific>-</FieldValueSpecific>
            )}
          </PatientGeneralInfo>
        )}
      </PatientGeneralWrapper>
      {/* patient health status */}
      <div>
        {patient && patient.vitals && (
          <div className="body-vitals-status-wrap">
            {Object.entries(patient.vitals).map((bodyParms, i) => {
              return (
                <div className="content-wrp" key={i}>
                  <div className="labels-with-current-stats">
                    <PatientVitalFieldName>
                      {bodyParms && bodyParms[0] === 'bloodPressure'
                        ? 'BP'
                        : bodyParms[0]}
                    </PatientVitalFieldName>
                    <div className="vital-current-info-stat">
                      <div
                        className="vital-current-value"
                        style={{ color: `${rangeCheck(bodyParms)[0]}` }}>
                        {bodyParms &&
                          bodyParms[1].current
                            .map((item) => item.value)
                            .join('-')}
                      </div>
                      <div style={{ color: `${rangeCheck(bodyParms)[0]}` }}>
                        {' '}
                        {bodyParms && bodyParms[1].unit === 'F' ? '\u00b0' : ''}
                      </div>
                      <div
                        className="vital-current-unit"
                        style={{ color: `${rangeCheck(bodyParms)[0]}` }}>
                        {bodyParms && bodyParms[1].unit}
                      </div>
                    </div>
                  </div>
                  <div className="graph-wrp-for-vitals">
                    <CMLine
                      className="custom-class"
                      data={bodyParms[1]}
                      preferences={{
                        graphColors: rangeCheck(bodyParms),
                        showCircleOnLines: false,
                        showAxisX: false,
                        showAxisY: false,
                        xScalePaddingOuter: 5,
                        maxRangeMultiplier: 2,
                        showTooltip: false,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
