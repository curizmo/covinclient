export const SHOW_SPINNER = 'SHOW_SPINNER';
export const HIDE_SPINNER = 'HIDE_SPINNER';
export const SHOW_CUSTOM_SPINNER = 'SHOW_CUSTOM_SPINNER';
export const HIDE_CUSTOM_SPINNER = 'HIDE_CUSTOM_SPINNER';

export const showSpinner = (payload) => ({
  type: SHOW_SPINNER,
  payload,
});

export const hideSpinner = () => ({
  type: HIDE_SPINNER,
});

export const showCustomSpinner = (payload) => ({
  type: SHOW_CUSTOM_SPINNER,
  payload,
});

export const hideCustomSpinner = () => ({
  type: HIDE_CUSTOM_SPINNER,
});
