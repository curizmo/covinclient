import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function getOrganizationEvents(organizationId) {
  return BEApi.get(`/organization-events/organization/${organizationId}`);
}

export function getOrganizationEvent(organizationEventId) {
  return BEApi.get(`/organization-events/${organizationEventId}`);
}

export function createOrganizationEvent(organizationEvent) {
  return BEApi.post('/organization-events/', organizationEvent);
}

export function editOrganizationEvent(organizationEvent, organizationEventId) {
  return BEApi.put(
    `/organization-events/${organizationEventId}`,
    organizationEvent,
  );
}

export function removeOrganizationEvent(organizationEventId) {
  return BEApi.delete(`/organization-events/${organizationEventId}`);
}
