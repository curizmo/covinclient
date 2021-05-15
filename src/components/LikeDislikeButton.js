import React, { useState } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import { LikeIcon } from './common/icons';

export const LikeDislikeButton = ({
  likes = 0,
  disabled = false,
  onLike = () => {},
  onDislike = () => {},
}) => {
  const [isLikeActive, setIsLikeActive] = useState(false);
  const [isDislikeActive, setIsDislikeActive] = useState(false);
  const [initLikes] = useState(likes);

  const toggleLikeColor = () => {
    setIsLikeActive((state) => !state);
    setIsDislikeActive(false);
  };

  const toggleDislikeColor = () => {
    setIsDislikeActive((state) => !state);
    setIsLikeActive(false);
  };

  const onClickLike = () => {
    if (isDislikeActive) {
      onLike();
      if (initLikes > 0) {
        onLike();
      }
    } else if (isLikeActive) {
      onDislike();
    } else {
      onLike();
    }
    toggleLikeColor();
  };

  const onClickDislike = () => {
    if (isLikeActive) {
      onDislike();
      onDislike();
    } else if (isDislikeActive) {
      if (initLikes > 0) {
        onLike();
      }
    } else {
      onDislike();
    }
    toggleDislikeColor();
  };

  return (
    <div className="d-flex flex-column align-items-center mr-2">
      <Button active={isLikeActive} disabled={disabled} onClick={onClickLike}>
        <LikeIcon isActive={isLikeActive} />
      </Button>
      <span
        className={`small ml-1 ${
          isLikeActive || isDislikeActive ? 'font-weight-bold' : ''
        }`}>
        {/* TODO animate the text when it changes */}
        {likes}
      </span>
      <Button
        active={isDislikeActive}
        disabled={disabled}
        onClick={onClickDislike}>
        <LikeIcon isActive={isDislikeActive} transform="rotate(-180 0 0)" />
      </Button>
    </div>
  );
};

LikeDislikeButton.propTypes = {
  likes: PropTypes.number,
  disabled: PropTypes.bool,
  onLike: PropTypes.func,
  onDislike: PropTypes.func,
};
