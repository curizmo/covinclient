import { lazy } from 'react';

const PatientBoard = lazy(() => import('../pages/PatientBoard'));
const PhysicianView = lazy(() => import('../pages/PhysicianView'));
const Patients = lazy(() => import('../pages/Patients/Patients'));
const PatientNote = lazy(() => import('../pages/PatientNote'));
const TeleHealth = lazy(() => import('../pages/TeleHealth'));
const AddPatient = lazy(() => import('../pages/AddPatient/AddPatient'));
const EditPatient = lazy(() => import('../pages/EditPatient'));
const CreateEncounter = lazy(() => import('../pages/CreateEncounter'));
const Login = lazy(() => import('../pages/Login'));
const Appointment = lazy(() => import('../pages/Appointment/Appointment'));
const Encounters = lazy(() => import('../pages/Encounters'));
const CreateProduct = lazy(() => import('../pages/CreateShopifyProduct'));
const EditProduct = lazy(() => import('../pages/EditShopifyProduct'));
const PatientEncounter = lazy(() =>
  import('../pages/PatientEncounter/PatientEncounter'),
);
const PhysicianSignup = lazy(() => import('../pages/PhysicianSignup'));
const Referrals = lazy(() => import('../pages/Referrals'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Prescriptions = lazy(() => import('../pages/Prescriptions'));
const Labs = lazy(() => import('../pages/Labs'));
const Directory = lazy(() => import('../pages/Directory'));
const Profile = lazy(() => import('../pages/Profile'));
const CreateCalendarBlock = lazy(() =>
  import('../pages/CalendarBlock/Create/CreateCalendarBlock'),
);
const ViewCalendarBlock = lazy(() =>
  import('../pages/CalendarBlock/View/ViewCalendarBlocks'),
);
const EditCalendarBlock = lazy(() =>
  import('../pages/CalendarBlock/Edit/EditCalendarBlock'),
);
const PractitionerNewAppointment = lazy(() =>
  import('../pages/PractitionerNewAppointment'),
);
const CreateOrganizationEvent = lazy(() =>
  import('pages/OrganizationEvent/Create'),
);
const ViewOrganizationEvents = lazy(() =>
  import('pages/OrganizationEvent/View'),
);
const EditOrganizationEvent = lazy(() =>
  import('pages/OrganizationEvent/Edit'),
);

export const routes = {
  patients: {
    path: '/patients',
    exact: true,
    isPrivate: true,
    component: Patients,
  },
  teleHealth: {
    path: '/tele-health',
    isPrivate: true,
    component: TeleHealth,
  },
  qna: {
    path: '/qna',
    isPrivate: false,
    component: PatientBoard,
  },
  physicianAIInterface: {
    path: '/physician-ai-interface',
    isPrivate: true,
    component: PhysicianView,
  },
  physician: {
    path: '/physician-view',
    isPrivate: true,
    component: PhysicianView,
  },
  patientEncounter: {
    path: '/my-encounters',
    exact: true,
    isPrivate: true,
    component: PatientEncounter,
  },
  patientNote: {
    path: '/patient/:patientId/note/new',
    isPrivate: true,
    component: PatientNote,
  },
  addPatient: {
    path: '/patients/new',
    isPrivate: true,
    component: AddPatient,
  },
  editPatient: {
    path: '/patients/edit/:patientId',
    isPrivate: true,
    component: EditPatient,
  },
  viewEncounters: {
    path: '/patients/:patientId/encounters',
    isPrivate: true,
    component: Encounters,
  },
  createEncounter: {
    path: '/patients/:patientId/encounter/create',
    isPrivate: true,
    component: CreateEncounter,
  },
  login: {
    path: '/login',
    isPrivate: false,
    component: Login,
  },
  profile: {
    path: '/profile',
    isPrivate: true,
    component: Profile,
  },
  appointments: {
    path: '/appointments',
    isPrivate: true,
    component: Appointment,
    exact: true,
  },
  createProduct: {
    path: '/clinic/:organizationId/marketplace/add',
    isPrivate: true,
    component: CreateProduct,
    exact: true,
  },
  editProduct: {
    path: '/clinic/:organizationId/marketplace/:productId/edit',
    isPrivate: true,
    component: EditProduct,
    exact: true,
  },
  referrals: {
    path: '/my-referrals',
    isPrivate: true,
    component: Referrals,
    exact: true,
  },
  physicianSignup: {
    path: '/physician-signup',
    isPrivate: true,
    component: PhysicianSignup,
    isNotPhysician: true,
    exact: true,
  },
  createCalendarBlock: {
    path: '/calendar-block/create',
    isPrivate: true,
    component: CreateCalendarBlock,
  },
  editCalendarBlock: {
    path: '/calendar-block/edit/:calendarBlockId',
    isPrivate: true,
    component: EditCalendarBlock,
  },
  viewCalendarBlock: {
    path: '/calendar-block',
    isPrivate: true,
    component: ViewCalendarBlock,
  },
  practitionerNewAppointment: {
    path: '/book-appointment',
    isPrivate: true,
    component: PractitionerNewAppointment,
  },
  createOrganizationEvent: {
    path: '/events/create',
    isPrivate: true,
    component: CreateOrganizationEvent,
  },
  editOrganizationEvent: {
    path: '/events/edit/:organizationEventId',
    isPrivate: true,
    component: EditOrganizationEvent,
  },
  viewOrganizationEvent: {
    path: '/events',
    isPrivate: true,
    component: ViewOrganizationEvents,
  },
  prescriptions: {
    path: '/prescriptions',
    exact: true,
    isPrivate: true,
    component: Prescriptions,
  },
  labs: {
    path: '/labs',
    exact: true,
    isPrivate: true,
    component: Labs,
  },
  directory: {
    path: '/directory',
    exact: true,
    isPrivate: true,
    component: Directory,
  },
  dashboard: {
    path: '/',
    exact: true,
    isPrivate: true,
    component: Dashboard,
  },
};
