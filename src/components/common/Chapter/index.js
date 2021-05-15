import React from 'react';
import * as PropTypes from 'prop-types';

import { Row } from 'reactstrap';

const Chapter = ({
  color = 'white',
  textColor = 'body',
  children,
  className = '',
}) => {
  return (
    <Row className={`bg-${color} text-${textColor} ${className}`}>
      {children}
    </Row>
  );
};

Chapter.propTypes = {
  color: PropTypes.string,
  textColor: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
};

export { Chapter };
