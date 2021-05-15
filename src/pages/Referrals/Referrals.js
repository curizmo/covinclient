import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
} from 'reactstrap';
import { useDispatch } from 'react-redux';

import * as practitionerService from '../../services/practitioner';
import * as referralService from '../../services/referral';

import { DashboardLayout } from '../../components/common/Layout';
import { EncounterModal } from './EncounterModal';

import { getISODate } from 'utils';

import { REFERRAL_STATUS, REFERRAL_STATUS_CLASSES } from '../../constants';

import { hideSpinner, showSpinner } from 'actions/spinner';

const tableHeader = [
  'Patient',
  'Referred By',
  'Reason',
  'Description',
  'Referral Date',
  'Status',
  'Action',
];

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [displayEncounterModal, setDisplayEncounterModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState({});
  const [isAcceptClick, setIsAcceptClick] = useState(false);
  const [displayReferralNoteModal, setDisplayReferralNoteModal] =
    useState(false);
  const [referralNote, setReferralNote] = useState('');
  const dispatch = useDispatch();

  const fetchReferrals = async () => {
    try {
      dispatch(showSpinner());
      const response = await practitionerService.fetchReferrals();

      let referrals = response.data.referrals;

      referrals = referrals.map((referral) => {
        return {
          ...referral,
          isSelected: false,
          displayDate: getISODate(referral.createdDate),
        };
      });

      referrals.sort((a, b) => {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      });

      setReferrals(referrals);
    } catch (err) {
      // @todo Handle error
    } finally {
      dispatch(hideSpinner());
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleViewEncounter = (referral) => {
    setSelectedReferral(referral);
    setDisplayEncounterModal(true);
  };

  const closeEncounterModal = () => {
    setSelectedReferral({});
    setDisplayEncounterModal(false);
  };

  const closeReferralNoteModal = () => {
    setSelectedReferral({});
    setDisplayReferralNoteModal(false);
    setReferralNote('');
  };

  const openReferralNoteModal = (referral, isAcceptClick) => {
    setSelectedReferral(referral);
    setIsAcceptClick(isAcceptClick);
    setDisplayReferralNoteModal(true);
  };

  const handleReferralNoteChange = (e) => {
    setReferralNote(e.target.value);
  };

  const saveReferralNote = async () => {
    try {
      dispatch(showSpinner());
      const payload = {
        id: selectedReferral.id,
        referralNote,
        referralStatus: isAcceptClick
          ? REFERRAL_STATUS.accepted
          : REFERRAL_STATUS.rejected,
      };

      await referralService.updateReferralStatus(selectedReferral.id, payload);

      closeReferralNoteModal();
      fetchReferrals();
    } catch (err) {
      // TODO: Handle error
      dispatch(hideSpinner());
    }
  };

  return (
    <DashboardLayout>
      {displayEncounterModal && (
        <EncounterModal
          referral={selectedReferral}
          handleClose={closeEncounterModal}
        />
      )}
      {displayReferralNoteModal && (
        <Modal isOpen toggle={closeReferralNoteModal}>
          <ModalHeader>
            {isAcceptClick ? 'Accept referral?' : 'Reject referral?'}
          </ModalHeader>
          <ModalBody>
            Enter note:
            <Input
              type="textarea"
              name="note"
              value={referralNote}
              onChange={handleReferralNoteChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button className="ml-2" onClick={saveReferralNote}>
              Save
            </Button>
            <Button
              color="danger"
              className="ml-2"
              onClick={closeReferralNoteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
      {referrals && referrals.length > 0 ? (
        <Table hover responsive>
          <thead>
            <tr>
              {tableHeader.map((header) => (
                <th key={header} className="sticky-top bg-light">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {referrals &&
              referrals.map((referral) => (
                <tr
                  key={`${referral.id}`}
                  className={referral.isSelected ? 'bg-secondary' : ''}>
                  <td>{`${referral.patient.firstName} ${referral.patient.lastName}`}</td>
                  <td>{`${referral.referredBy.firstName} ${referral.referredBy.lastName}`}</td>
                  <td>{referral.reason}</td>
                  <td>{referral.description}</td>
                  <td>{referral.displayDate}</td>
                  <td
                    className={
                      REFERRAL_STATUS_CLASSES[referral.referralStatus]
                    }>
                    {referral.referralStatus}
                  </td>
                  <td>
                    <Button
                      className="ml-2 mb-2 referral-buttons"
                      onClick={() => handleViewEncounter(referral)}>
                      View Encounters
                    </Button>
                    {referral.referralStatus === REFERRAL_STATUS.pending ? (
                      <>
                        <Button
                          className="ml-2 mb-2 referral-buttons"
                          onClick={() => openReferralNoteModal(referral, true)}>
                          Accept
                        </Button>
                        <Button
                          color="danger"
                          className="ml-2 referral-buttons"
                          onClick={() =>
                            openReferralNoteModal(referral, false)
                          }>
                          Reject
                        </Button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
        <p className="p-3">No referrals</p>
      )}
    </DashboardLayout>
  );
};

export default Referrals;
