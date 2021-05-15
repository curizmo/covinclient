import { loadStripe } from '@stripe/stripe-js';
import { BEApi } from './api';

import { basedConfig } from '../config';

export const stripePromise = loadStripe(basedConfig.stripe.publicKey);

/**
 * @param {string} currency
 * @param {number} amount
 * @param {CancelToken} cancelToken
 * @returns {Promise<object>}
 */
export async function postPaymentIntent(currency, amount, cancelToken) {
  try {
    const { data } = await BEApi.post(
      '/stripe/create-payment-intent',
      JSON.stringify({ currency, amount }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken,
      },
    );
    return data;
  } catch (error) {
    return { error };
  }
}
