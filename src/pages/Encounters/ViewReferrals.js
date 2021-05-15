import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { REFERRAL_STATUS_CLASSES } from '../../constants';

const ViewReferrals = ({ isOpen, referrals, handleCloseReferralModal }) => {
  return (
    <Modal isOpen={isOpen} toggle={handleCloseReferralModal}>
      <ModalHeader toggle={handleCloseReferralModal}>Referrals</ModalHeader>
      <ModalBody>
        {referrals &&
          referrals.map((referral) => {
            return (
              <div key={referral.id} className="pb-2 border-bottom">
                <div>Referred To: {referral.practitioner.name}</div>
                <div>Reason: {referral.reason}</div>
                <div>Description: {referral.description}</div>
                <div>
                  Status:{' '}
                  <span
                    className={
                      REFERRAL_STATUS_CLASSES[referral.referralStatus]
                    }>
                    {referral.referralStatus}
                  </span>
                </div>
                <div>{`Doctor's note: ${referral.referralNote}`}</div>
              </div>
            );
          })}
      </ModalBody>
    </Modal>
  );
};

ViewReferrals.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseReferralModal: PropTypes.func,
  referrals: PropTypes.array,
};

export { ViewReferrals };
