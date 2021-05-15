import React, { useState, useEffect } from 'react';
import { CancelToken } from 'axios';
import * as PropTypes from 'prop-types';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Spinner, Form, FormGroup } from 'reactstrap';

import { postPaymentIntent } from '../../../../services/stripe';
import { paymentStatus } from '../../../../constants';
import { cardStyle } from './style';

const CheckoutForm = ({ paymentData }) => {
  const { confirmBooking, currency, amount } = paymentData;
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [cancelToken, setCancelToken] = useState('');

  const getPaymentIntent = async (currency, amount, cancelToken) => {
    const payment = await postPaymentIntent(currency, amount, cancelToken);
    payment && payment.clientSecret && setClientSecret(payment.clientSecret);
  };

  useEffect(() => {
    const signal = CancelToken.source();
    setCancelToken(signal.token);
    return () => {
      signal.cancel();
    };
  }, []);

  useEffect(() => {
    getPaymentIntent(currency, amount, cancelToken);
  }, [currency, amount, cancelToken]);

  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    const paymentIntent = payload && payload.paymentIntent;
    if (paymentIntent && paymentIntent.status === paymentStatus.succeeded) {
      const { id, currency, amount, created } = paymentIntent;
      confirmBooking({ id, currency, amount, created });
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    } else {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <FormGroup>
        <CardElement options={cardStyle} onChange={handleChange} />
      </FormGroup>
      {error && (
        <p className="text-danger small" role="alert">
          {error}
        </p>
      )}
      <FormGroup className="text-right mt-5">
        <Button color="primary" disabled={processing || disabled || succeeded}>
          {processing ? <Spinner color="light" /> : 'Pay'}
        </Button>
      </FormGroup>
    </Form>
  );
};

CheckoutForm.propTypes = {
  paymentData: PropTypes.shape({
    confirmBooking: PropTypes.func,
    currency: PropTypes.string,
    amount: PropTypes.number,
  }),
};

export { CheckoutForm };
