import React from 'react';
import { useSelector } from 'react-redux';

import { getUser } from 'selectors';

import PatientAppointments from './PatientAppointments';
import PractitionerAppointments from './PractitionerAppointments';

const Appointment = () => {
  const user = useSelector(getUser);

  if (user.isPractitioner) {
    return <PractitionerAppointments />;
  }

  return <PatientAppointments />;
};

export default Appointment;
