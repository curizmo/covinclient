import React from 'react';
import PropTypes from 'prop-types';
import { CardHeader } from 'reactstrap';

export const CardLeftPanel = (props) => (
  <CardHeader>
    <span className="text-primary font-weight-bold mr-2">Q.</span>
    {props.title} {props.metaData}
  </CardHeader>
);

CardLeftPanel.propTypes = {
  title: PropTypes.string,
  metaData: PropTypes.node,
};
