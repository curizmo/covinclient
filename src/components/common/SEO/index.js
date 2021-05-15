import React from 'react';
import { Helmet } from 'react-helmet';
import * as PropTypes from 'prop-types';

const SEO = ({ data }) => {
  return (
    <Helmet>
      <title>{data.title}</title>
      <meta name="title" content={data.title} />
      <meta name="description" content={data.description} />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
    </Helmet>
  );
};

SEO.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export { SEO };
