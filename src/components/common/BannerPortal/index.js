import React from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';

import { BannerMessage } from '../BannerMessage';

import { getBannerMessage } from '../../../selectors';
import { clearMessage } from '../../../actions/message';
import { banner } from '../../../constants';

const bannerRoot = document.getElementById(banner.BANNER_ROOT_ID);

export const BannerPortal = () => {
  const dispatch = useDispatch();
  const bannerMessage = useSelector(getBannerMessage);
  const close = () => dispatch(clearMessage());

  const bannerJSX = bannerMessage.type ? (
    <BannerMessage {...bannerMessage} close={close} />
  ) : null;

  return createPortal(bannerJSX, bannerRoot);
};
