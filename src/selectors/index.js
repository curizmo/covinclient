export const getOrganizations = ({ organizations }) => organizations;
export const getOrganization = ({ organization }) => organization.data;
export const getOrganizationID = ({ organization }) =>
  organization.data.OrganizationID;
export const getOrganizationSubdomain = ({ organization }) =>
  organization.data.Subdomain;
export const getOrganizationName = ({ organization }) =>
  organization.data && organization.data.OrganizationName;
export const getOrganizationEvents = ({ organization }) => organization.events;
export const getOrganizationBookings = ({ organization }) =>
  organization.bookings;
export const getBannerMessage = ({ message }) => message;
export const getUser = ({ user }) => user.data;
export const getUserId = ({ user }) => user.data.AuthID;
export const getUserAppointment = ({ user }) => user.appointments;
export const getIsShowSpinner = ({ spinner }) => spinner.isShow;
export const getIsLoginInProgress = ({ login }) => login.isInProgress;
export const getAppointment = ({ appointment }) => appointment;
export const getTwilioDevice = ({ twilio }) => twilio.device;
export const getTwilioConnection = ({ twilio }) => twilio.connection;
export const getCart = ({ cart }) => cart.cart;
export const getAmount = ({ cart }) => cart.totalAmount;
export const getProducts = ({ cart }) => cart.products;
export const getPractitioners = ({ practitioner }) =>
  practitioner.data.practitioners || [];

const getAvailableDatesObject = (appointments) =>
  (appointments.availableDateTime && appointments.availableDateTime.data) || {};
export const getAvailableDateTime = ({ appointments }) =>
  getAvailableDatesObject(appointments).dateTimeMapping || {};
export const getAvailableDatesKeys = ({ appointments }) =>
  getAvailableDatesObject(appointments).datesKeys || [];

export const getUnansweredQuestions = ({ questionBoard }) =>
  questionBoard.unansweredQuestions;
export const getQuestions = ({ questionBoard }) => questionBoard.questions;

export const getIsShowSidebar = ({ sidebar }) => sidebar.isShowSidebar;

export const getPatient = ({ patient }) => patient;
export const getIsEncounterUpdated = ({ patient }) =>
  patient?.isEncounterUpdated;

export const getIsShowSearchSpinner = ({ search }) => search?.isShowSpinner;
export const getSearchText = ({ search }) => search?.text;
export const getSearchResult = ({ search }) => search?.result;
export const getPatientsHasNext = ({ search }) => search?.hasNext;
