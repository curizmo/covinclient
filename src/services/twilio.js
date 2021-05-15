import { BEApi } from './api';

export async function createTwilioToken() {
  return BEApi.get('/twilio');
}
