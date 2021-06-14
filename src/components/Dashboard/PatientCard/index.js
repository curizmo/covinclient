import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { routes } from 'routers';
import { useSelector } from 'react-redux';

import { getRandomKey, rangeCheck, getTabIndex } from 'utils';
import { CMLine } from 'third-party/senze-graphs/dist';
import * as patientVitalsService from '../../../services/patientVitals';
import mobileIcon from 'assets/images/svg-icons/icon-phone.svg';
import excel from 'assets/images/svg-icons/excel.svg';
import xicon from 'assets/images/x-icon.png';
import { isLightVersion } from '../../../config';
import {
  GENDER_SHORTHAND,
  VitalsDateFields,
  LabDateFields,
} from '../../../constants';
import { CAMEL_CASE_REGEX } from '../../../constants/regex';
import { getUser } from '../../../selectors';

import { setDate, setDateTime } from '../../../global';
import { exportIndividualVitalsToCSV } from 'utils/vitalsDownload';

import './index.css';

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
  position: relative;
`;

const ButtonWrap = styled.div`
  position: absolute;
  right: 5px;
  top: -33px;
  margin-left: 5px;
  margin-bottom: 5px;
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
  const user = useSelector(getUser);

  const exportVitals = async (patientId) => {
    const [vitals, lab] = await Promise.all([
      patientVitalsService.getIndividualPatientVitals(
        user.PractitionerID,
        patientId,
      ),
      patientVitalsService.getLabResults(user.PractitionerID, patientId),
    ]);

    let vitalDetails = vitals.data.map((vital) => {
      for (const key in vital) {
        const result = key.replace(CAMEL_CASE_REGEX, ' $1');
        const title = result.charAt(0).toUpperCase() + result.slice(1);
        if (title !== key) {
          vital[title] = vital[key];
          delete vital[key];
        }
      }

      return {
        ...vital,
        [VitalsDateFields.updated]: setDateTime(
          vital[VitalsDateFields.updated],
        ),
        [VitalsDateFields.dob]: setDate(vital[VitalsDateFields.dob]),
        [VitalsDateFields.patientSince]: setDate(
          vital[VitalsDateFields.patientSince],
        ),
        [VitalsDateFields.doseOne]: setDate(vital[VitalsDateFields.doseOne]),
        [VitalsDateFields.doseTwo]: setDate(vital[VitalsDateFields.doseTwo]),
      };
    });

    let labResults = lab.data.map((lab) => {
      return {
        ...lab,
        [LabDateFields.updated]: setDateTime(lab[LabDateFields.updated]),
        [LabDateFields.specimenDrawnDate]: setDate(
          lab[LabDateFields.specimenDrawnDate],
        ),
      };
    });

    exportIndividualVitalsToCSV(vitalDetails, labResults);
  };

  return (
    <div className="patient-info">
      {/*patient name & state */}
      <PatientStatusWrp>
        {!isLightVersion && <State selectedState={patient.status} />}
        <PatientName>
          <Link
            to={routes.createEncounter.path.replace(
              ':patientId',
              patient.patientId,
            )}>
            {patient?.fullName}
          </Link>
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
            &nbsp;<FieldValue>{GENDER_SHORTHAND[patient.gender]}</FieldValue>
          </PatientGeneralInfo>
        ) : null}
        {patient?.age ? (
          <PatientGeneralInfo>
            <FieldName>Age:</FieldName>
            &nbsp;<FieldValue>{patient.age}</FieldValue>
          </PatientGeneralInfo>
        ) : null}
        <ButtonWrap className="ml-2 ">
          <div
            className="mobile-download-button"
            role="button"
            onClick={() => {
              exportVitals(patient.patientId);
            }}
            onKeyDown={(e) => {
              e.key === 'Enter' && exportVitals(patient.patientId);
            }}
            tabIndex={getTabIndex()}>
            <span className="excel-image-wrap-mobile">
              <img
                src={excel}
                alt="Covin"
                className="logo download-excel-icon-mobile"
              />
              <img src={xicon} alt="Covin" className="logo x-icon-mobile" />
            </span>
          </div>
        </ButtonWrap>
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
            {Object.entries(patient.vitals).map((bodyParams) => {
              if (!bodyParams[1].data.length) {
                return null;
              }

              return (
                <div className="content-wrp" key={getRandomKey()}>
                  <div className="labels-with-current-stats">
                    <PatientVitalFieldName>
                      {bodyParams && bodyParams[0] === 'bloodPressure'
                        ? 'BP'
                        : bodyParams[0]}
                    </PatientVitalFieldName>
                    <div className="vital-current-info-stat">
                      <div
                        className="vital-current-value"
                        style={{ color: `${rangeCheck(bodyParams)[0]}` }}>
                        {bodyParams &&
                          bodyParams[1].current
                            .map((item) => item.value)
                            .join('-')}
                      </div>
                      <div style={{ color: `${rangeCheck(bodyParams)[0]}` }}>
                        {bodyParams && bodyParams[1].unit === 'F'
                          ? '\u00b0'
                          : ''}
                      </div>
                      <div
                        className="vital-current-unit"
                        style={{ color: `${rangeCheck(bodyParams)[0]}` }}>
                        {bodyParams ? bodyParams[1].unit : ''}
                      </div>
                    </div>
                  </div>
                  <div className="graph-wrp-for-vitals">
                    <CMLine
                      className="custom-class"
                      data={bodyParams[1]}
                      preferences={{
                        graphColors: rangeCheck(bodyParams),
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
