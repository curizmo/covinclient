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
  PastNote,
  LoadingIcon,
  UploadContainer,
  FileName,
} from './styles';

import { getTabIndex } from 'utils';
import { downloadFileFromBlob } from 'utils/file';

import { ENTER } from '../../constants';

import * as fileService from 'services/file';

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

  const handleFileDownload = async (file) => {
    try {
      const response = await fileService.getFile(file.file);

      downloadFileFromBlob(response.data, file.name);
    } catch (err) {
      // TODO: Handle error
    }
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
            className="d-none"
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
              if (!note.notes && !note?.labResults?.length) {
                return null;
              }

              return (
                <PastNote key={note.encounterId}>
                  <div className="mb-2">{note.eventStartTime}</div>
                  {note.notes ? <div>{note.notes}</div> : null}
                  {note?.labResults?.map((labResult) => {
                    return (
                      <div
                        className="mt-2"
                        role="button"
                        tabIndex={getTabIndex()}
                        onClick={() => handleFileDownload(labResult)}
                        onKeyPress={(e) => {
                          if (e.key === ENTER) {
                            handleFileDownload(labResult);
                          }
                        }}
                        key={labResult.name}>
                        <ImAttachment className="mr-1" />
                        {labResult.name}
                      </div>
                    );
                  })}
                </PastNote>
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
