import { TOGGLE_SIDEBAR } from 'actions/sidebar';

export const initialState = {
  isShowSidebar: false,
};

const sidebar = (state = initialState, { type }) => {
  switch (type) {
    case TOGGLE_SIDEBAR:
      return {
        isShowSidebar: !state.isShowSidebar,
      };
    default:
      return state;
  }
};

export { sidebar };
