export * from './regex';

export const bannerTypes = {
  commonError: 'commonError',
  default: 'default',
  error: 'error',
  success: 'success',
  warning: 'warning',
};

export const cancelRequestMessage = 'REST API request has been canceled';

export const weekDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const excelTitleCell = [
  'A1',
  'B1',
  'C1',
  'D1',
  'E1',
  'F1',
  'G1',
  'H1',
  'I1',
  'J1',
  'K1',
  'L1',
  'M1',
  'N1',
  'O1',
  'P1',
  'Q1',
  'R1',
  'S1',
  'T1',
  'U1',
  'V1',
];

export const excelLabTitleCell = [
  'A1',
  'B1',
  'C1',
  'D1',
  'E1',
  'F1',
  'G1',
  'H1',
  'I1',
  'J1',
  'K1',
  'L1',
  'M1',
  'N1',
  'O1',
  'P1',
  'Q1',
  'R1',
  'S1',
];

export const VitalsDateFields = {
  updated: 'Last Vitals Update',
  dob: 'Date Of Birth',
  patientSince: 'Patient Since',
  doseOne: 'Dose1 Vaccination On',
  doseTwo: 'Dose2 Vaccination On',
};

export const LabDateFields = {
  updated: 'Data Updated At',
  specimenDrawnDate: 'Lab Specimen Drawn On',
};

export const DIAL = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '*',
  '0',
  '#',
];

export const showRecentlyVisited = 4;

export const paymentStatus = {
  paid: 'Paid',
  succeeded: 'succeeded',
};

export const paymentMethod = {
  freeConsultation: 'Free Consultation',
};

export const ENTER = 'Enter';

export const MINUTES_IN_HOUR = 60;

export const SECONDS_IN_MINUTE = 60;

export const MILLISECONDS_IN_SECOND = 1000;

export const MILLISECONDS_IN_MINUTE =
  MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE;

export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;

export const HOURS_IN_DAY = 24;

export const MILLISECONDS_IN_DAY =
  SECONDS_IN_HOUR * MILLISECONDS_IN_SECOND * HOURS_IN_DAY;

export const SHOW_TIMER_BEFORE_HOURS = 1;

export const GENDER_SHORTHAND = {
  female: 'F',
  male: 'M',
  other: 'O',
};

export const GENDER_OPTIONS = [
  {
    label: 'M',
    value: 'male',
  },
  {
    label: 'F',
    value: 'female',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

export const RECCURENCE_TYPES = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export const banner = {
  BANNER_ROOT_ID: 'banner-root',
};

export const spinner = {
  SPINNER_ROOT_ID: 'spinner-root',
};

export const bannerShowTime = 3000;

export const ENCOUNTER_STATUS = {
  finished: 'finished',
  planned: 'planned',
  arrived: 'arrived',
  triaged: 'triaged',
  inProgress: 'in-progress',
  onLeave: 'onleave',
  cancelled: 'cancelled',
};

export const stringLimiter = 30;

export const steps = ['chooseOrganization', 'chooseBookingData'];

export const continueModalQuestion = {
  header: 'Appointment created successfully!',
  paragraphs: (confirmationNumber) => [
    'Thank your for your appointment.',
    `Your confirmation number is ${confirmationNumber}.`,
    'You will receive an email shortly about your visit with additional details.',
  ],
};

export const APPOINTMENT_EVENT_STATUSES = {
  Cancelled: 'Cancelled',
  CheckedIn: 'CheckedIn',
  Confirmed: 'Confirmed',
  Completed: 'Completed',
  InProgress: 'InProgress',
  Open: 'Open',
  RescheduleRequested: 'RescheduleRequested',
  Requested: 'Requested',
};

export const APPOINTMENT_EVENT_STATUSES_CLASSES = {
  Cancelled: 'text-danger',
  CheckedIn: 'text-success',
  Confirmed: 'text-success',
  Completed: 'text-success',
  InProgress: 'text-success',
  Open: 'text-success',
  RescheduleRequested: 'text-warning',
  Requested: 'text-warning',
};

export const APPOINTMENT_EVENT_NAME = {
  LongVisit: 'Long Visit',
  ShortVisit: 'Short Visit',
  PhoneVisit: 'Phone Visit',
};

export const CALL_METHODS = {
  JITSI: 'Jitsi',
  TWILIO: 'Twilio',
};

export const APPOINTMENT_EVENT_STATUS_TEXT = {
  [APPOINTMENT_EVENT_STATUSES.Cancelled]: 'Cancelled',
  [APPOINTMENT_EVENT_STATUSES.CheckedIn]: 'Checked In',
  [APPOINTMENT_EVENT_STATUSES.Confirmed]: 'Confirmed',
  [APPOINTMENT_EVENT_STATUSES.Completed]: 'Completed',
  [APPOINTMENT_EVENT_STATUSES.InProgress]: 'In Progress',
  [APPOINTMENT_EVENT_STATUSES.Open]: 'Open',
  [APPOINTMENT_EVENT_STATUSES.RescheduleRequested]: 'Reschedule Requested',
  [APPOINTMENT_EVENT_STATUSES.Requested]: 'Requested',
};

export const MESSAGE_TYPES = {
  MESSAGE: 'MESSAGE',
  FILE: 'FILE',
};

export const LOBBY_WIDTH = '560';
export const LOBBY_HEIGHT = '315';

export const AUDIO_FRAME = 'audio';
export const VIDEO_FRAME = 'video';
export const BOOK_FRAME = 'book';
export const GAME_FRAME = 'game';

export const PATH_PARAMS = {
  subdomain: '/:subdomain',
};

export const ORGANIZATION_TYPES = {
  CARE_TEAM: 'CareTeam',
};

export const PRACTITIONER_TYPES = {
  PHYSICIAN: 'Physician',
};

export const PATIENT_APPOINTMENTS_VIEWS = {
  UPCOMING: 'Upcoming appointments',
  CLOSED: 'Closed appointments',
};

export const PHYSICIAN_APPOINTMENTS_VIEWS = {
  TODAYS: "Today's appointments",
  ...PATIENT_APPOINTMENTS_VIEWS,
};

export const APPOINTMENTS_VIEWS = {
  ...PHYSICIAN_APPOINTMENTS_VIEWS,
  ...PATIENT_APPOINTMENTS_VIEWS,
};

export const APPOINTMENTS_VIEW = {
  TODAYS: 'todays',
  UPCOMING: 'upcoming',
  CLOSED: 'closed',
};

export const APPOINTMENTS_VIEW_ENUM = {
  TODAYS: 0,
  UPCOMING: 1,
  CLOSED: 2,
};

export const VIDEO_CONSTRAINTS = {
  ENVIRONMENT: 'environment',
  USER: 'user',
};

export const VIDEO_INPUT = 'videoinput';

export const GRID_COLUMNS_NUMBER = 12;

export const SCHEDULE_STATUS = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
};

export const FILE_TYPES = {
  FILE: 'file',
  IMAGE: 'image',
};

export const DAYS_IN_WEEK = 7;

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DIRECTION = {
  left: 'left',
  right: 'right',
};

export const REFERRAL_STATUS = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const REFERRAL_STATUS_CLASSES = {
  [REFERRAL_STATUS.pending]: 'text-warning',
  [REFERRAL_STATUS.rejected]: 'text-danger',
  [REFERRAL_STATUS.accepted]: 'text-success',
};

export const TASK_STATUS = {
  pending: 'Pending',
  completed: 'Completed',
  rejected: 'Rejected',
};

export const TASK_STATUS_CLASSES = {
  [TASK_STATUS.pending]: 'text-warning',
  [TASK_STATUS.rejected]: 'text-danger',
  [TASK_STATUS.completed]: 'text-success',
};

export const PAYMENT_STATUSES = {
  NoPayment: 'No Payment',
  NotPaid: 'Not Paid',
  Paid: 'Paid',
};

export const PAYMENT_STATUSES_CLASSESS = {
  NoPayment: 'text-success',
  NotPaid: 'text-danger',
  Paid: 'text-success',
};

export const ONE_SECOND_IN_MILLISECONDS = 1000;

export const TIME_ZONE_DATABASE_NAME = {
  PST: 'America/Los_Angeles',
};

export const DAYS_INITIAL_VALUE = {
  MON: false,
  TUE: false,
  WED: false,
  THUR: false,
  FRI: false,
  SAT: false,
  SUN: false,
};

export const PER_PAGE = 10;

export const SORT_ORDER = Object.freeze({
  Descending: 'DESC',
  Ascending: 'ASC',
});

export const RISK = {
  HIGH: 'High',
  MODERATE: 'Moderate',
  LOW: 'Low',
};

export const PATIENT_CURRENT_STATUS = {
  ACTIVE: 'Active',
  INIT: 'Init',
};

export const NOT_AVAILABLE = 'N/A';

export const scales = {
  temperature: {
    minValueDomainYaxis: 90,
    maxValueDomainYaxis: 111,
  },
  spO2: {
    minValueDomainYaxis: 20,
    maxValueDomainYaxis: 101,
  },
};

export const RangeCheck = {
  temperature: {
    High: { min: 99.2, max: 109.9 },
    Elevated: { min: 80, max: 97.7 },
    Normal: { min: 97.8, max: 99.1 },
  },
  spO2: {
    Normal: { min: 95, max: 100 },
    Elevated: { min: 90, max: 94 },
    High: { min: 0, max: 89 },
  },
  'Pulse Rate': {
    High: { min: 101, max: 300 },
    Elevated: { min: 0, max: 59 },
    Normal: { min: 60, max: 100 },
  },
  'Blood Pressure': {
    'Low Blood Pressure': {
      Normal: { min: 60, max: 80 },
      Elevated: { min: 0, max: 59 },
      High: { min: 81, max: 300 },
    },
    'High Blood Pressure': {
      Normal: { min: 90, max: 120 },
      Elevated: { min: 0, max: 119 },
      High: { min: 121, max: 300 },
    },
  },
  'Respiratory Rate': {
    Normal: { min: 12, max: 20 },
    Elevated: { min: 0, max: 11 },
    High: { min: 21, max: 100 },
  },
};

export const INTAKE_FORM_GROUPS = {
  PRE_EXISTING_CONDITION: 'Pre-existing condition',
  PERSONAL_INFORMATION: 'Personal Information',
  COVID_19_CONDITION: 'Covid-19 Condition',
  CURRENT_MEDICATION: 'Current Medication',
  ALLERGY: 'Allergy',
};

export const INDIA_COUNTRY_CODE = 'IN';
