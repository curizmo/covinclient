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

const SendToPatientPreviewModal = ({
  show,
  prescriptionList,
  setShowPreviewWindow,
}) => {
  const [activeTab, setActiveTab] = React.useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const closeModal = () => {
    setShowPreviewWindow(false);
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
            <Table>
              <thead className="table-header">
                <tr>
                  <th>SL</th>
                  <th>Name</th>
                  <th>Dosage / Notes</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{item.name}</td>
                      <td>{item.frequency}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TabPane>
          <TabPane tabId="2">Tab 2 Contents</TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
        <Button>Send To Patient</Button>
      </ModalFooter>
    </Modal>
  );
};

export default SendToPatientPreviewModal;
