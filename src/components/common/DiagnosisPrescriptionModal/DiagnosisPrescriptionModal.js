import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader, ModalBody, Button, Table } from 'reactstrap';
import { Code } from 'react-content-loader';
import { Plus } from 'react-feather';

import * as appointmentService from 'services/appointment';

const DiagnosisPrescriptionModal = ({ closeModal, notes, appendToNote }) => {
  const { t } = useTranslation('common');
  const [diagnosis, setDiagnosis] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPhoenixOpinion(notes);
  }, []);

  const getDiagnosis = async (note) => {
    try {
      setIsLoading(true);
      const response = await appointmentService.getDiagnosis({
        note,
      });

      setDiagnosis(response.data.diagnosis);
    } catch (err) {
      // TODO: Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const getPrescriptions = async (note) => {
    try {
      const response = await appointmentService.getPrescriptions({ note });

      setPrescriptions(response.data.prescriptions);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const getPhoenixOpinion = (notes) => {
    getDiagnosis(notes);
    getPrescriptions(notes);
  };

  const addDiagnosisToNotes = (description) => {
    const newNote = `${notes}\n\n[Diagnosis]:\n${description}`;
    appendToNote(newNote);
  };

  const addPrescriptionToNotes = (description) => {
    const newNote = `${notes}\n\n[Prescription]:\n${description}`;
    appendToNote(newNote);
  };

  return (
    <Modal size="lg" isOpen={true} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>{t('phoenixOpinion')}</ModalHeader>
      <ModalBody>
        {isLoading && <Code />}
        {!isLoading && diagnosis?.length > 0 ? (
          <>
            <div className="d-flex justify-content-between font-weight-bold my-2">
              <div>Diagnosis</div>
              <div></div>
            </div>
            {diagnosis.map((data) => {
              return (
                <>
                  <div
                    key={data.displayName}
                    className="d-flex justify-content-between w-100 mb-2">
                    <div>
                      {`${data.longDescription} (${data.score}%)`}
                      <Table hover responsive className="table-container mt-3">
                        <thead className="table-header">
                          <tr>
                            <th>Medication</th>
                            <th>Dose</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.items.map((subItem) => {
                            return (
                              <tr key={subItem.medDescr}>
                                <td>{subItem.medDescr}</td>
                                <td>{subItem.stdDosesDescr}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                    <div>
                      <Button
                        className="btn-sm"
                        onClick={() =>
                          addDiagnosisToNotes(data.longDescription)
                        }>
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </>
              );
            })}
          </>
        ) : null}
        {!isLoading && prescriptions?.length > 0 ? (
          <>
            <div className="d-flex justify-content-between font-weight-bold my-2">
              <div>Prescriptions</div>
            </div>
            {prescriptions.map((data) => {
              return (
                <div
                  key={data.prescription}
                  className="d-flex justify-content-between w-100 mb-2">
                  <div>{`${data.prescription} (${data.score}%)`}</div>
                  <div>
                    <Button
                      className="btn-sm"
                      onClick={() => addPrescriptionToNotes(data.prescription)}>
                      <Plus />
                    </Button>
                  </div>
                </div>
              );
            })}
          </>
        ) : null}
      </ModalBody>
    </Modal>
  );
};

export { DiagnosisPrescriptionModal };
