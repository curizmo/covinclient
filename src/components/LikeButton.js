import React, { useState, useCallback } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import { LikeIcon } from './common/icons';

export const LikeButton = ({
  likes = 0,
  disabled = false,
  onLike = () => {},
}) => {
  const [isLikeActive, setIsLikeActive] = useState(false);
  const [initLikes] = useState(likes);

  const onClickLike = useCallback(() => {
    if (likes === initLikes) {
      onLike();
      setIsLikeActive(true);
    }
  }, [likes, initLikes]);

  return (
    <Button
      color="link"
      active={isLikeActive}
      disabled={disabled}
      onClick={onClickLike}>
      <LikeIcon />
      <span className={`small ml-1 ${isLikeActive ? 'font-weight-bold' : ''}`}>
        {/* TODO animate the text when it changes */}
        {likes}
      </span>
    </Button>
  );
};

LikeButton.propTypes = {
  likes: PropTypes.number,
  disabled: PropTypes.bool,
  onLike: PropTypes.func,
};
