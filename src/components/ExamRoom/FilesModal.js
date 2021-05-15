import React from 'react';
import { AiOutlineDownload } from 'react-icons/ai';

import { FILE_TYPES } from '../../constants';

import { Modal } from '../common/Modal';

const FilesModal = ({
  handleClose,
  files,
  handleFileDownload,
  openImageModal,
}) => {
  return (
    <Modal close={handleClose} isCloseButton>
      <div className="d-flex flex-wrap overflow-auto mh-100">
        {files &&
          files.map((file) => {
            if (file.fileType === FILE_TYPES.IMAGE) {
              return (
                <div className="w-25 m-3">
                  <div
                    role="button"
                    tabIndex="0"
                    onClick={() => openImageModal(file.fileUrl)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        openImageModal(file.fileUrl);
                      }
                    }}>
                    <img
                      className="img-fluid cursor-pointer"
                      key={file.fileUrl}
                      src={file.fileUrl}
                      loading="lazy"
                      alt={file.fileName}
                    />
                  </div>
                </div>
              );
            }
            return (
              <span
                className="w-25 m-3"
                key={file.fileUrl}
                onClick={() => handleFileDownload(file.fileName)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleFileDownload(file.fileName);
                  }
                }}
                role="button"
                tabIndex="0">
                <AiOutlineDownload />
                {file.fileName}
              </span>
            );
          })}
      </div>
    </Modal>
  );
};

export { FilesModal };
