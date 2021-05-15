import React from 'react';
import * as PropTypes from 'prop-types';

import { SEO } from '../SEO';
import { BannerPortal } from '../BannerPortal';
import { SpinnerPortal } from '../SpinnerPortal';

import { seoData } from '../../../constants/seo';

const Layout = ({ children }) => {
  return (
    <>
      <SEO data={seoData} />
      {children}
      <BannerPortal />
      <SpinnerPortal />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.element,
};

export { Layout };
export { DashboardLayout } from './DashboardLayout';
