import React from 'react';
import * as PropTypes from 'prop-types';
import CallDialog from 'components/common/CallDialog';

const DashboardLayout = ({ children }) => {
  return (
    <>
      <main>
        <div className="content overflow-auto">{children}</div>
      </main>
      <CallDialog />
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export { DashboardLayout };
