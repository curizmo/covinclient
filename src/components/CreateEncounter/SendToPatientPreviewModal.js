import React from 'react';

import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import classnames from 'classnames';

import { getISODate } from '../../utils';

const SendToPatientPreviewModal = ({
  show,
  prescriptionList,
  patientData,
  setShowPreviewWindow,
}) => {
  const [activeTab, setActiveTab] = React.useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const closeModal = () => {
    setShowPreviewWindow(false);
  };

  const renderPatientDetails = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '10px',
        }}>
        <div>
          <div>
            <span className="patient-detail-bold">Name:</span>
            <span className="patient-detail-text">{patientData.fullName}</span>
          </div>
          <div>
            <span className="patient-detail-bold">Age/Gender:</span>
            <span className="patient-detail-text">
              {patientData.age}/{patientData.gender}
            </span>
          </div>
          <div>
            <span className="patient-detail-bold">Date:</span>
            <span className="patient-detail-text">
              {' '}
              {getISODate(new Date())}{' '}
            </span>
          </div>
          <div>
            <span className="patient-detail-bold">Phone:</span>
            <span className="patient-detail-text">{patientData.phone} </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={show} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>Order Preview</ModalHeader>
      <ModalBody>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => {
                toggle('1');
              }}>
              Prescription
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => {
                toggle('2');
              }}>
              Labs
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {renderPatientDetails()}
            <Table>
              <thead className="table-header">
                <tr>
                  <th>SL</th>
                  <th>Name</th>
                  <th>Dosage / Notes</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionList
                  .filter((c) => c.label === 'prescription')
                  .map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.frequency}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </TabPane>
          <TabPane tabId="2">
            {renderPatientDetails()}
            <Table>
              <thead className="table-header">
                <tr>
                  <th>SL</th>
                  <th>Name</th>
                  <th>Tests / Notes</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionList
                  .filter((c) => c.label === 'lab')
                  .map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.frequency}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
        <Button>Send To Patient</Button>
      </ModalFooter>
    </Modal>
  );
};

export default SendToPatientPreviewModal;
