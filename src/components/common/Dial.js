import React from 'react';
import * as PropTypes from 'prop-types';

import { DIAL } from 'constants/index';

import { Button } from 'reactstrap';

const Dial = ({ onDigitDialed }) => {
  const handleClick = (e) => {
    onDigitDialed(e.currentTarget.textContent);
  };

  return (
    <div className="dial-window">
      <div className="dial-window-container">
        <div className="dial-row">
          {DIAL.map((num) => {
            return (
              <Button className="dial-digit" onClick={handleClick} key={num}>
                {num}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Dial.propTypes = {
  onDigitDialed: PropTypes.func,
};

export { Dial };
