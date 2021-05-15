import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function updatePatientEventCredits(organizationEventId) {
  return BEApi.put(
    `/patient-event-credits/organization-event/${organizationEventId}`,
    {},
  );
}
