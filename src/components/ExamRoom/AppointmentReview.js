import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { Button, Container, Col, Row } from 'reactstrap';

import { LinkButton } from 'components/common/Button/LinkButton';

import * as appointmentService from '../../services/appointment';

const AppointmentReview = ({ appointment }) => {
  const starsCount = 5;
  const [stars, setStars] = useState(null);
  const [review, setReview] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = async () => {
    const payload = {
      stars,
      review,
      appointmentId: appointment.organizationEventBookingId,
    };

    await appointmentService.createAppointmentReview(payload);

    history.push('/');
  };

  return (
    <Container>
      <Row>
        <Col md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }}>
          <div className="py-5 text-center">
            <h2>How was your visit?</h2>
            <div className="my-3">
              {[...Array(starsCount)].map((i, index) => {
                const value = index + 1;

                return (
                  <span key={index}>
                    {stars >= value ? (
                      <AiFillStar
                        size={24}
                        className="d-inline m-1 cursor-pointer text-warning"
                        onClick={() => setStars(value)}
                      />
                    ) : (
                      <AiOutlineStar
                        size={24}
                        className="d-inline m-1 cursor-pointer"
                        onClick={() => setStars(value)}
                      />
                    )}
                  </span>
                );
              })}
            </div>
            <div className="mb-3">
              <textarea
                value={review}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Leave your review..."
              />
              <Button color="primary" onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>
            <LinkButton to="/" color="link">
              Back to home
            </LinkButton>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

AppointmentReview.propTypes = {
  appointment: PropTypes.object,
};

export { AppointmentReview };
