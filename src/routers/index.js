import { lazy } from 'react';

const Patients = lazy(() => import('../pages/Patients/Patients'));
const AddPatient = lazy(() => import('../pages/AddPatient/AddPatient'));
const EditPatient = lazy(() => import('../pages/EditPatient'));
const CreateEncounter = lazy(() => import('../pages/CreateEncounter'));
const Login = lazy(() => import('../pages/Login'));
const Encounters = lazy(() => import('../pages/Encounters'));
const NonPhysician = lazy(() => import('../pages/NonPhysician'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Prescriptions = lazy(() => import('../pages/Prescriptions'));
const Labs = lazy(() => import('../pages/Labs'));
const Directory = lazy(() => import('../pages/Directory'));
const Profile = lazy(() => import('../pages/Profile'));
const TeleHealth = lazy(() => import('../pages/TeleHealth'));

export const routes = {
  nonPhysician: {
    path: '/non-physician',
    exact: true,
    isPrivate: true,
    isNotPhysician: true,
    component: NonPhysician,
  },
  teleHealth: {
    path: '/tele-health',
    isPrivate: true,
    component: TeleHealth,
  },
  patients: {
    path: '/patients',
    exact: true,
    isPrivate: true,
    component: Patients,
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
