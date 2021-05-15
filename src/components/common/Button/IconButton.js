import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

const IconButton = ({ IconElement, text = '', linkTo, onClick }) => {
  return linkTo ? (
    <Link to={linkTo} className="btn-icon">
      <IconElement />
      <span>{text}</span>
    </Link>
  ) : (
    <Button onClick={onClick} className="btn-icon">
      <IconElement />
      <span>{text}</span>
    </Button>
  );
};

IconButton.propTypes = {
  IconElement: PropTypes.func,
  text: PropTypes.string,
  linkTo: PropTypes.string,
  onClick: PropTypes.func,
};

export { IconButton };
