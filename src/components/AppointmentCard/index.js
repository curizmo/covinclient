import React from 'react';

import { StyledAppointmentCard } from './style';

import { getAppointmentTime, getAppointmentDate } from '../../utils/dateTime';

export const AppointmentCard = ({ appointments }) => {
  return (
    <>
      {appointments &&
        appointments.map((appointment) => {
          return (
            <StyledAppointmentCard key={appointment.organizationEventBookingId}>
              <div className="card-container">
                <div className="p-4">
                  <h2 className="text-white">
                    {appointment.practitionerTypeDesc}
                  </h2>
                  <h2 className="text-purple-300">{`${appointment.practitionerFirstName} ${appointment.practitionerLastName}`}</h2>
                </div>
                <div className="time-container">
                  <div>{getAppointmentDate(appointment.eventStartTime)}</div>
                  <div>{getAppointmentTime(appointment.eventStartTime)}</div>
                </div>
              </div>
            </StyledAppointmentCard>
          );
        })}
    </>
  );
};
