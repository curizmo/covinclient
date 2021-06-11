import React, { useRef } from 'react';
import * as PropTypes from 'prop-types';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { AiOutlineUpload, AiOutlineClose } from 'react-icons/ai';
import { ImAttachment } from 'react-icons/im';

import notesIcon from 'assets/images/svg-icons/notesIcon.svg';

import HeadersComponent from 'components/common/HeadersComponent/HeadersComponent';
import {
  ContentWrap,
  NoteCaption,
  Note,
  TopContainer,
  NoteContainer,
  PastNotesContainer,
  PastNote,
  LoadingIcon,
  UploadContainer,
  FileName,
  ColumnContainer,
  DateText,
  FileText,
  NoteText,
} from './styles';

import { getRandomKey, getTabIndex } from 'utils';
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
  const imageUploadRef = useRef(null);

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
      <HeadersComponent image={notesIcon} alt={'notes-icon'} text={'Notes'} />
      <ColumnContainer>
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

          <PastNotesContainer>
            {pastNotes?.length > 0 &&
              pastNotes.map((note) => {
                if (!note.notes && !note?.labResults?.length) {
                  return null;
                }
                return (
                  <PastNote key={getRandomKey()}>
                    <DateText className="mb-2">{note.eventStartTime}</DateText>
                    {note.notes ? <NoteText>{note.notes}</NoteText> : null}
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
                          <FileText>{labResult.name}</FileText>
                        </div>
                      );
                    })}
                  </PastNote>
                );
              })}
          </PastNotesContainer>
        </ContentWrap>
      </ColumnContainer>
    </>
  );
};

PatientNotes.propTypes = {
  data: PropTypes.object,
};
