import React from 'react';
import * as PropTypes from 'prop-types';
import { Elements } from '@stripe/react-stripe-js';

import { CheckoutForm } from './CheckoutForm';
import { stripePromise } from '../../../services/stripe';

const Payment = ({ paymentData }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm paymentData={paymentData} />
    </Elements>
  );
};

Payment.propTypes = {
  paymentData: PropTypes.shape({
    confirmBooking: PropTypes.func,
    currency: PropTypes.string,
    amount: PropTypes.number,
  }),
};

export { Payment };
