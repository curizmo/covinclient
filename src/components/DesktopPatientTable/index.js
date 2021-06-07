import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';

import { GraphicalRepresentation } from 'components/GraphicalRepresentation';
import { SpinnerComponent } from 'components/common/SpinnerPortal/Spinner';

import * as patientVitalsService from 'services/patientVitals';
import { getUser } from 'selectors';
import { getFormatedTimeDate, handleCallAppointment } from 'utils';
import { exportIndividualVitalsToCSV } from 'utils/vitalsDownload';
import { isLightVersion } from 'config';
import {
  GENDER_SHORTHAND,
  VitalsDateFields,
  LabDateFields,
} from '../../constants';
import { CAMEL_CASE_REGEX } from '../../constants/regex';
import { setDate, setDateTime } from 'global';
import { routes } from 'routers';
import mobileIcon from 'assets/images/svg-icons/icon-phone.svg';
import excel from 'assets/images/svg-icons/excel.svg';
import xicon from 'assets/images/x-icon.png';
import './index.css';

const Wrapper = styled.section`
  position: relative;
  padding: 0 4rem;
  width: 100%;
  height: calc(100% - 110px);
  overflow: ${(props) => (props?.isShowSpinner ? 'hidden' : 'scroll')};
`;

const TableWrapper = styled.div``;

const Status = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.selectedCases === 'High'
      ? '#eb2f2f'
      : props.selectedCases === 'Mild'
      ? '#657396'
      : '#e5881b'};
  width: 1rem;
  height: 1rem;
  margin-right: 1.25rem;
`;

const InfoAndGraphWrapper = styled.div`
  padding: 1.25rem;
  background-color: #fff;
  margin-bottom: 5px;
  box-shadow: 0px 2px 0px rgba(101, 115, 150, 0.2);
  border-radius: 4px;
`;
const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Info = styled.div`
  display: flex;
  width: ${(props) => props.width};
`;

const ButtonWrap = styled.div`
  position: absolute;
  right: 92px;
  margin-left: 5px;
  margin-bottom: 5px;
`;

const Label = styled.span`
  color: ${(props) => (props.label === 'name' ? '#01518D' : '#657396')};
  font-size: ${(props) => (props.label === 'name' ? '1.25rem' : '0.875rem')};
  line-height: ${(props) => (props.label === 'name' ? '1.875rem' : '1.25rem')};
  width: ${(props) => props.width};
  cursor ${(props) => (props.cusrsor ? 'pointer' : '')};
  img {
    margin-right: 0.625rem;
  }
`;
const Value = styled.span`
  font-weight: 700;
  color: #657396;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-left: 4px;
`;

const spacingAroundComponent = css`
  height: 7rem;
  background: #f2f5f8;
  padding: 0.5rem;
  margin: 1rem 0.2rem 0.3125rem;
  display: flex;
`;

const desktopViewLabelsForPatientsWithCurrentStats = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 11rem;
`;

const DesktopPatientTable = (props) => {
  const { selectedCaseData, isShowSpinner } = props;
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const onCall = useCallback(
    (patientId) => () => handleCallAppointment(dispatch, patientId),
    [dispatch],
  );

  const [downloadingPatientId, setDownloadingPatientId] = useState(null);

  const exportVitals = async (patientId) => {
    try {
      setDownloadingPatientId(patientId);

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
    } catch (err) {
      // TODO: Handle error
    } finally {
      setDownloadingPatientId(null);
    }
  };

  if (selectedCaseData?.length < 1 && !isShowSpinner) {
    return null;
  }

  return (
    <Wrapper isShowSpinner={isShowSpinner}>
      <TableWrapper className="dashboard-container">
        {selectedCaseData?.map((patient, index) => {
          return (
            <InfoAndGraphWrapper key={index} className="mb-3">
              <InfoWrapper>
                {!isLightVersion ? (
                  <>
                    <Status selectedCases={patient.status} />
                    <Link
                      className="card-name patient-link--small min-width-20 mr-2"
                      to={routes.editPatient.path.replace(
                        ':patientId',
                        patient.patientId,
                      )}>
                      {patient.fullName}
                    </Link>
                  </>
                ) : (
                  <Link
                    className="card-name patient-link--small min-width-20 mr-2 mb-0"
                    to={routes.editPatient.path.replace(
                      ':patientId',
                      patient.patientId,
                    )}>
                    <p className="card-name patient-link--small min-width-20 mr-2 mb-0">
                      {patient.fullName}
                    </p>
                  </Link>
                )}
                <Info className="min-width-20 mr-2">
                  <Button
                    className="d-flex"
                    onClick={onCall(patient.patientId)}>
                    <img
                      src={mobileIcon}
                      alt="phone"
                      className="mr-2"
                      size="0.8em"
                    />
                    <Value>{patient.phone}</Value>
                  </Button>
                </Info>
                <Info className="min-width-10 mr-2">
                  <Label>Gender:</Label>
                  <Value>{GENDER_SHORTHAND[patient.gender] || '-'}</Value>
                </Info>
                <Info className="min-width-10 mr-2">
                  <Label>Age:</Label>
                  <Value>{patient.age || '-'}</Value>
                </Info>
                <Info>
                  <Label>Last updated:</Label>
                  <Value>{getFormatedTimeDate(patient?.lastUpdated)}</Value>
                </Info>
                <ButtonWrap className="ml-2 ">
                  <Button
                    className="btn btn-download-small"
                    disabled={downloadingPatientId === patient.patientId}
                    onClick={() => {
                      exportVitals(patient.patientId);
                    }}>
                    {downloadingPatientId === patient.patientId ? (
                      <div className="lds-spinner position-absolute">
                        {[...Array(12).keys()].map((i) => (
                          <span key={i} />
                        ))}
                      </div>
                    ) : (
                      <>
                        <span className="excel-image-wrap-small">
                          <img
                            src={excel}
                            alt="Covin"
                            className="logo download-excel-icon-small"
                          />
                          <img
                            src={xicon}
                            alt="Covin"
                            className="logo x-icon-small"
                          />
                        </span>
                        DOWNLOAD (Xls)
                      </>
                    )}
                  </Button>
                </ButtonWrap>
              </InfoWrapper>
              <div className="desktop-view-vitals-wrp display-flex-direction">
                <GraphicalRepresentation
                  data={patient}
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
                    maxRangeMultiplier: 1.8,
                    yAxisFontSize: 3,
                  }}
                />
              </div>
            </InfoAndGraphWrapper>
          );
        })}
      </TableWrapper>
      {isShowSpinner && (
        <SpinnerComponent
          customClasses="position-absolute"
          isFullScreen={false}
        />
      )}
    </Wrapper>
  );
};

export default DesktopPatientTable;
