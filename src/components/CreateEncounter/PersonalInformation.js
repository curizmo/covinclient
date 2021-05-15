import React, { useState, useEffect, useMemo } from 'react';
import * as PropTypes from 'prop-types';
import { FormGroup, Button } from 'reactstrap';

import { InputField } from 'components/common/InputField';
import { StatusIndicator } from 'components/common/StatusIndicator';
import { InfoItem, CommunicationButtons } from 'components/CreateEncounter';

import showMoreIcon from 'assets/images/svg-icons/showMore.svg';
import showLessIcon from 'assets/images/svg-icons/showLess.svg';
import { getISODate } from 'utils';
import {
  RISK,
  PATIENT_CURRENT_STATUS,
  NOT_AVAILABLE,
  GENDER_SHORTHAND,
} from '../../constants';

export const PersonalInformation = ({
  data,
  register,
  setRiskLevel,
  riskLevel,
  dispatch,
}) => {
  const [isShowMore, setIsShowMore] = useState(false);

  const toggleShowMore = () => setIsShowMore((state) => !state);

  useEffect(() => {
    setRiskLevel(data?.status);
  }, [data, setRiskLevel]);

  const updateRiskLevel = (event) => {
    setRiskLevel(event?.currentTarget?.value);
  };

  const additionalInfo = useMemo(
    () => [
      {
        label: 'Gender:',
        value: GENDER_SHORTHAND[data.gender] ?? NOT_AVAILABLE,
      },
      { label: 'Age:', value: data.age ?? NOT_AVAILABLE },
      { label: 'Weight:', value: data.weight ?? NOT_AVAILABLE },
      { label: 'Height:', value: data.height ?? NOT_AVAILABLE },
      { label: 'Mobile:', value: data.phone },
      {
        label: 'Current Status:',
        value: data.currentStatus ?? PATIENT_CURRENT_STATUS.ACTIVE,
      },
      { label: 'Address:', value: data.address },
      { label: 'Patient since:', value: getISODate(data.createdDate) },
      { label: 'Known Allergies:', value: data.allergies ?? NOT_AVAILABLE },
      {
        label: 'Pre-existing conditions:',
        value: data.conditions ?? NOT_AVAILABLE,
      },
      { label: 'Family history:', value: data.history ?? NOT_AVAILABLE },
    ],
    [data],
  );

  return (
    <div className={`top-view ${isShowMore ? 'show-more' : ''} flex-column`}>
      <div className="w-100 d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <StatusIndicator status={riskLevel} size={16} />
          </div>
          <p className="patient-link--small card-name m-0">{data.fullName}</p>
        </div>
        <Button onClick={toggleShowMore} className="transparent-button">
          {isShowMore ? (
            <img src={showLessIcon} alt="show more" />
          ) : (
            <img src={showMoreIcon} alt="show more" />
          )}
        </Button>
        <FormGroup check row className="mx-0 pl-0">
          <div className="d-flex mt-2">
            {Object.keys(RISK).map((key) => (
              <InputField
                key={key}
                id={key}
                value={RISK[key]}
                name="risk"
                innerRef={register}
                title={RISK[key]}
                type="radio"
                checked={riskLevel === RISK[key]}
                onChange={updateRiskLevel}
              />
            ))}
          </div>
        </FormGroup>
        <CommunicationButtons dispatch={dispatch} patientId={data.patientId} />
        <Button type="submit" className="btn-covin dark">
          SAVE AND CLOSE
        </Button>
      </div>
      {isShowMore ? (
        <div className="d-flex w-full flex-wrap mt-2">
          {additionalInfo.map((infoItem) => (
            <InfoItem
              value={infoItem?.value}
              key={infoItem?.label}
              label={infoItem?.label}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

PersonalInformation.propTypes = {
  data: PropTypes.object,
};
