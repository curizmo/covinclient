import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const FlagButton = ({ selected, onClick }) => {
  return (
    <Button color="link" onClick={onClick} active={selected}>
      <svg
        style={{ fill: selected ? '#ee6c4d' : '#000' }}
        viewBox="0 0 15 13"
        width="15"
        xmlns="http://www.w3.org/2000/svg">
        <g id="Layer_1">
          <g>
            <path d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z" />
          </g>
        </g>
      </svg>
    </Button>
  );
};

FlagButton.propTypes = {
  onClick: PropTypes.object,
  selected: PropTypes.bool,
};

export default FlagButton;
