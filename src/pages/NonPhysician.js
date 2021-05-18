import React from 'react';
import { DashboardLayout } from 'components/common/Layout';

const NonPhysician = () => {
  return (
    <DashboardLayout className="w-full">
      <p>You do not have rights to access the application.</p>
      <p>
        Please contact the administrator or login with an active physician
        account.
      </p>
    </DashboardLayout>
  );
};

export default NonPhysician;
