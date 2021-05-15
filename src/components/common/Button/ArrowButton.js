import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import { DIRECTION } from '../../../constants';

export const ArrowButton = ({ direction = DIRECTION.left, ...rest }) => (
  <Button {...rest}>
    <span className="h3 text-primary">
      {direction === DIRECTION.left ? '<' : '>'}
    </span>
  </Button>
);

ArrowButton.propTypes = {
  direction: PropTypes.oneOf(Object.keys(DIRECTION)),
};
