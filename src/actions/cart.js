export const SET_CART = 'SET_CART';
export const SET_PRODUCTS = 'SET_PRODUCTS';

/**
 * @param {Cart[]} payload
 */
export const setCart = (payload) => ({
  type: SET_CART,
  payload,
});

export const setProducts = (payload) => ({
  type: SET_PRODUCTS,
  payload,
});
