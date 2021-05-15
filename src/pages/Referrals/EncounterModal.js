import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Button } from 'reactstrap';
import { AiOutlineDownload } from 'react-icons/ai';

import { getISODate } from 'utils';
import { downloadFileFromBlob } from 'utils/file';

import * as appointmentService from 'services/appointment';
import * as fileService from 'services/file';

import { FILE_TYPES } from '../../constants';

import { InputField } from 'components/common/InputField';
import { ImageModal } from 'components/common/ImageModal';

import config from 'config/config';

const EncounterModal = ({ referral, handleClose }) => {
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [display, setDisplay] = useState({
    note: true,
  });
  const [displayImageModal, setDisplayImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const fetchAppointmentsEncounters = async (appointments) => {
    try {
      const appointmentIds = appointments.map(
        (appointment) => appointment.organizationEventBookingId,
      );

      const response = await appointmentService.fetchAppointmentsEncounters(
        appointmentIds,
      );

      const encounters = response.data.encounters;
      const encountersObject = {};

      encounters.forEach((encounter) => {
        encountersObject[encounter.organizationEventBookingId] = {
          ...encounter,
        };
      });

      const appointmentsWithEncounter = appointments.map((appointment) => {
        const data = encountersObject[appointment.organizationEventBookingId];
        const files =
          data.files &&
          data.files.map((file) => {
            return {
              ...file,
              fileName: file.fileUrl.replace(
                `${config.domainURL}/file/encounter/`,
                '',
              ),
            };
          });

        return {
          ...appointment,
          eventStartTime: getISODate(appointment.eventStartTime),
          encounter: {
            ...data,
            files,
          },
        };
      });

      setSelectedAppointment(appointmentsWithEncounter[0]);
      setAppointments(appointmentsWithEncounter);
    } catch (err) {
      // TODO: Handle error
    }
  };

  useEffect(() => {
    fetchAppointmentsEncounters(referral.appointments);
  }, [referral.appointments]);

  const handleAppointmentSelect = (e) => {
    const selectedAppointment = appointments.find(
      (appointment) =>
        appointment.organizationEventBookingId === e.target.value,
    );

    setSelectedAppointment(selectedAppointment);
  };

  const handleFileDownload = async (fileName) => {
    try {
      const response = await fileService.getEncounterFile(fileName);

      downloadFileFromBlob(response.data, fileName);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const openImageModal = (imageUrl) => {
    setDisplayImageModal(true);
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setDisplayImageModal(false);
    setModalImage(null);
  };

  return (
    <>
      {displayImageModal && (
        <ImageModal handleClose={closeImageModal} imageUrl={modalImage} />
      )}
      <Modal isOpen toggle={handleClose}>
        <ModalHeader toggle={handleClose}>View Encounters</ModalHeader>
        <ModalBody>
          <Input
            type="select"
            className="mb-3"
            onChange={handleAppointmentSelect}
            value={selectedAppointment.organizationEventBookingId}>
            {appointments.map((appointment) => {
              return (
                <option
                  key={appointment.organizationEventBookingId}
                  value={appointment.organizationEventBookingId}>
                  {`Appointment on ${appointment.eventStartTime}`}
                </option>
              );
            })}
          </Input>
          <div className="mb-3">
            <Button
              color="primary"
              className={`${display.note ? 'active' : ''}`}
              onClick={() => setDisplay({ note: true })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setDisplay({ note: true });
                }
              }}
              role="button"
              tabIndex={0}>
              Notes
            </Button>{' '}
            <Button
              color="primary"
              className={`${display.files ? 'active' : ''}`}
              onClick={() => setDisplay({ files: true })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setDisplay({ files: true });
                }
              }}
              role="button"
              tabIndex={0}>
              Files
            </Button>
          </div>
          {display.note && (
            <InputField
              inline={false}
              type="textarea"
              value={
                selectedAppointment &&
                selectedAppointment.encounter &&
                selectedAppointment.encounter.note
              }
              disabled
              rows="10"
            />
          )}
          {display.files && (
            <div className="d-flex flex-wrap overflow-auto mh-100">
              {selectedAppointment &&
              selectedAppointment.encounter &&
              selectedAppointment.encounter.files &&
              selectedAppointment.encounter.files.length ? (
                selectedAppointment.encounter.files.map((file) => {
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
                            alt=""
                          />
                        </div>
                        <span>{file.fileName}</span>
                      </div>
                    );
                  }
                  return (
                    <span
                      className="w-25 m-3"
                      key={file.fileUrl}
                      role="button"
                      tabIndex="0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleFileDownload(file.fileName);
                        }
                      }}
                      onClick={() => handleFileDownload(file.fileName)}>
                      <AiOutlineDownload />
                      {file.fileName}
                    </span>
                  );
                })
              ) : (
                <div>No files available</div>
              )}
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export { EncounterModal };
