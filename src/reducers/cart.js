import { SET_CART, SET_PRODUCTS } from '../actions/cart';

/**
 * @returns {Cart{}}
 */
export const initialState = {
  cart: [],
  products: [],
  totalAmount: 0,
};

/**
 * @param {Cart{}} state
 * @param {string} type - action type
 * @returns {Cart{}}
 */
const cart = (state = initialState, { type, payload }) => {
  let totalAmount = 0;
  switch (type) {
    case SET_CART:
      payload.forEach((item) => {
        totalAmount = totalAmount + parseFloat(item.price) * item.quantity;
      });

      return {
        ...state,
        cart: payload,
        totalAmount,
      };
    case SET_PRODUCTS:
      return {
        ...state,
        products: payload,
      };
    default:
      return state;
  }
};

export { cart };
