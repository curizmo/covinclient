import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineDownload } from 'react-icons/ai';

import { MESSAGE_TYPES, FILE_TYPES } from 'constants/index';

const ChatMessage = (props) => {
  const { message, user, handleFileDownload, openImageModal } = props;
  return (
    <div
      className={`w-75 p-2 m-2 text-break rounded-lg shadow-sm 
      ${
        // TODO: Compare this with message.user.id
        message.user.email === user.Email
          ? 'align-self-end bg-secondary'
          : 'align-self-start bg-light'
      }`}>
      {message.messageType === MESSAGE_TYPES.FILE ? (
        message.fileType === FILE_TYPES.IMAGE ? (
          <>
            <div
              role="button"
              tabIndex="0"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  openImageModal(message.message);
                }
              }}
              onClick={() => openImageModal(message.message)}>
              <img
                className="img-fluid cursor-pointer"
                src={message.message}
                loading="lazy"
                alt=""
              />
            </div>
            <span>{message.fileName}</span>
          </>
        ) : (
          <span
            role="button"
            tabIndex="0"
            onClick={() => handleFileDownload(message.fileName)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleFileDownload(message.fileName);
              }
            }}>
            <AiOutlineDownload />
            {message.fileName}
          </span>
        )
      ) : (
        <div>{message.message}</div>
      )}
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.object,
  user: PropTypes.object,
  handleFileDownload: PropTypes.func,
  openImageModal: PropTypes.func,
};

export { ChatMessage };
