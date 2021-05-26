import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { FaCheck, FaSpinner } from 'react-icons/fa';

import notesIcon from 'assets/images/svg-icons/notesIcon.svg';
import showMoreIcon from 'assets/images/svg-icons/showMore.svg';
import showLessIcon from 'assets/images/svg-icons/showLess.svg';

import HeadersComponent from 'components/common/HeadersComponent/HeadersComponent';
import {
  ContentWrap,
  NoteCaption,
  Note,
  TopContainer,
  NoteContainer,
  ImgButton,
  DesktopViewPastPrescription,
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
    <>
      <HeadersComponent
        image={notesIcon}
        alt={'notes-icon'}
        text={'Add Notes'}
      />
      <ContentWrap>
        <TopContainer className="position-relative">
          <NoteContainer>
            <NoteCaption>{new Date().toLocaleDateString()}</NoteCaption>
            <Note
              value={note}
              onChange={handleNoteChange}
              placeholder="Add details"
            />
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
          </NoteContainer>
        </TopContainer>

        <DesktopViewPastPrescription showMore={showMore}>
          <HeadersComponent
            image={notesIcon}
            alt={'notes-icon'}
            text={'Past Notes'}>
            <div>
              {showMore ? (
                <ImgButton type="button" onClick={toggleShowMore}>
                  <img src={showMoreIcon} alt="show more" />
                </ImgButton>
              ) : (
                <ImgButton type="button" onClick={toggleShowMore}>
                  <img src={showLessIcon} alt="show less" />
                </ImgButton>
              )}
            </div>
          </HeadersComponent>
          {showMore &&
            pastNotes?.length > 0 &&
            pastNotes.map((note) => {
              if (!note.notes) {
                return null;
              }

              const value = `${note.eventStartTime}\n${note.notes}`;

              return (
                <LastRow key={note.encounterId}>
                  <Note value={value} disabled />
                </LastRow>
              );
            })}
        </DesktopViewPastPrescription>
      </ContentWrap>
    </>
  );
};

PatientNotes.propTypes = {
  data: PropTypes.object,
};
