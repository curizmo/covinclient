import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export const LinkButton = (props) => (
  <Button tag={Link} {...props}>
    {props.children}
  </Button>
);

LinkButton.propTypes = {
  children: PropTypes.node,
};
