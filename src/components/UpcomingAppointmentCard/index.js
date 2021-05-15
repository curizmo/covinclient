import React from 'react';

import { StyledCard } from './style';

import { getAppointmentDate, getAppointmentTime } from '../../utils/dateTime';

export const UpcomingAppointmentCard = ({ apoointments }) => {
  return (
    <StyledCard>
      {apoointments.map((appointment) => {
        return (
          <div key={appointment.organizationEventBookingId}>
            <div className="text-green-600">
              {appointment.practitionerTypeDesc}
            </div>
            <div className="py-4">
              <h2 className="name">
                {`${appointment.practitionerFirstName} ${appointment.practitionerLastName}`}
              </h2>
              <div className="date">
                <div>{getAppointmentDate(appointment.eventStartTime)}</div>

                <div>{getAppointmentTime(appointment.eventStartTime)}</div>
              </div>
            </div>
            <div className="organization">{appointment.organizationName}</div>
          </div>
        );
      })}
    </StyledCard>
  );
};
