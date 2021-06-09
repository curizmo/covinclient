import React from 'react';
import * as PropTypes from 'prop-types';
import CallDialog from 'components/common/CallDialog';

const DashboardLayout = ({ children, style }) => {
  return (
    <>
      <main>
        <div className={`content ${style}`}>{children}</div>
      </main>
      <CallDialog />
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export { DashboardLayout };
