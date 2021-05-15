import React from 'react';
import * as PropTypes from 'prop-types';
import CallDialog from 'components/common/CallDialog';

const DashboardLayout = ({ children }) => {
  return (
    <>
      <main>
        <div className="content py-1 px-md-7 pb-md-7 pt-md-3">{children}</div>
      </main>
      <CallDialog />
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export { DashboardLayout };
