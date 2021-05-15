import React from 'react';
import * as PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';
import { PractitionerView } from './PratitionaerView';

const PractitionersViewList = ({ practitioners = [] }) => {
  return (
    <Container>
      <h2 className="mb-5 text-center">Featured Doctors</h2>
      <Row>
        {practitioners.map((practitionerProps, index) => (
          <Col key={index} md="6">
            <PractitionerView {...practitionerProps} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

PractitionersViewList.propTypes = {
  practitioners: PropTypes.arrayOf(
    PropTypes.shape({
      photoSrc: PropTypes.string,
      name: PropTypes.string,
      specialty: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};

export { PractitionersViewList };
