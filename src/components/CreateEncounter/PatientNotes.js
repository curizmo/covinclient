import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { FaCheck, FaSpinner } from 'react-icons/fa';

import notesIcon from '../../assets/images/notesIcon.svg';
import showMoreIcon from 'assets/images/svg-icons/showMore.svg';
import showLessIcon from 'assets/images/svg-icons/showLess.svg';

import HeadersComponent from 'components/common/HeadersComponent/HeadersComponent';
import {
  ContentWrap,
  Note,
  TopContainer,
  ImgButton,
  IconSmall,
  DesktopViewPastPrescription,
  PastOrderText,
  LastRow,
  LoadingIcon,
} from './styles';

export const PatientNotes = ({
  note,
  handleNoteChange,
  pastNotes,
  isNoteLoading,
  isNoteSaved,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div>
      <HeadersComponent image={notesIcon} alt={'notes-icon'} text={'Notes'} />
      <ContentWrap>
        <TopContainer className="position-relative">
          <Note value={note} onChange={handleNoteChange} />
          {isNoteLoading && (
            <LoadingIcon
              color="link"
              className="position-absolute ml-4"
              disabled={true}>
              {isNoteSaved ? (
                <FaCheck className="green" />
              ) : (
                <FaSpinner className="spin" />
              )}
            </LoadingIcon>
          )}
        </TopContainer>

        <DesktopViewPastPrescription>
          <PastOrderText>
            <div>
              <IconSmall>
                <img src={notesIcon} alt="notes" />
              </IconSmall>
              Past Notes
            </div>
            <div>
              {showMore ? (
                <ImgButton type="button" onClick={toggleShowMore}>
                  <img src={showLessIcon} alt="show less" />
                </ImgButton>
              ) : (
                <ImgButton type="button" onClick={toggleShowMore}>
                  <img src={showMoreIcon} alt="show more" />
                </ImgButton>
              )}
            </div>
          </PastOrderText>
          {showMore && pastNotes?.length
            ? pastNotes.map((note) => {
                if (!note.notes) {
                  return null;
                }

                const value = `${note.eventStartTime}\n${note.notes}`;

                return (
                  <LastRow key={note.encounterId}>
                    <Note value={value} disabled />
                  </LastRow>
                );
              })
            : null}
        </DesktopViewPastPrescription>
      </ContentWrap>
    </div>
  );
};

PatientNotes.propTypes = {
  data: PropTypes.object,
};
