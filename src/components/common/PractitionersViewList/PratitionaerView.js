import React from 'react';
import * as PropTypes from 'prop-types';

import { Media } from 'reactstrap';

const PractitionerView = ({
  photoSrc = '',
  name = '',
  specialty = '',
  description = '',
}) => {
  return (
    <Media>
      <Media left src={photoSrc} alt={name} className="mr-3 w-25" />
      <Media body>
        <Media heading className="mb-0">
          {name}
        </Media>
        <u>{specialty}</u>
        <p className="mt-2">{description}</p>
      </Media>
    </Media>
  );
};

PractitionerView.propTypes = {
  photoSrc: PropTypes.string,
  name: PropTypes.string,
  specialty: PropTypes.string,
  description: PropTypes.string,
};

export { PractitionerView };
