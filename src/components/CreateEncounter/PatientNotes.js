import React, { useRef, useState } from 'react';
import * as PropTypes from 'prop-types';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { AiOutlineUpload, AiOutlineClose } from 'react-icons/ai';
import { ImAttachment } from 'react-icons/im';

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
  UploadContainer,
  FileName,
} from './styles';

import { getTabIndex } from 'utils';

import { ENTER } from '../../constants';

export const PatientNotes = ({
  note,
  handleNoteChange,
  pastNotes,
  isNoteLoading,
  isNoteSaved,
  labResults,
  handleFileSelect,
  handleRemoveFile,
}) => {
  const [showMore, setShowMore] = useState(false);
  const imageUploadRef = useRef(null);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleUploadClick = () => {
    imageUploadRef.current.click();
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
          <UploadContainer
            role="button"
            tabIndex={getTabIndex()}
            onClick={handleUploadClick}
            onKeyPress={(e) => {
              if (e.key === ENTER) {
                handleUploadClick();
              }
            }}>
            <AiOutlineUpload className="mr-2" />
            Upload a file
          </UploadContainer>
          <input
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={imageUploadRef}
          />
          {labResults?.length ? (
            <div>
              {labResults.map((labResult) => {
                return (
                  <div key={labResult.name}>
                    <ImAttachment className="mr-1" />
                    <FileName>{labResult.name} </FileName>
                    <AiOutlineClose
                      className="ml-1"
                      role="button"
                      tabIndex={getTabIndex()}
                      onClick={() => handleRemoveFile(labResult)}
                      onKeyPress={(e) => {
                        if (e.key === ENTER) {
                          handleRemoveFile(labResult);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
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
