import { useDispatch, useSelector } from 'react-redux';

import * as cartActions from '../actions/cart';

import { getProducts } from '../selectors';

const useCart = () => {
  const dispatch = useDispatch();
  const products = useSelector(getProducts);

  const handlePlusClick = (item) => {
    const items = products.map((product) => {
      if (product.id === item.id) {
        return {
          ...product,
          quantity: item.quantity + 1,
        };
      }

      return product;
    });

    setCart(items);
  };

  const handleMinusClick = (item) => {
    const items = products.map((product) => {
      if (product.id === item.id) {
        const quantity = product.quantity - 1;

        return {
          ...product,
          quantity,
          isItemInCart: !(quantity === 0),
        };
      }

      return product;
    });

    setCart(items);
  };

  const toggleAddToCart = (item) => {
    const items = products.map((product) => {
      if (product.id === item.id) {
        const isItemInCart = !product.isItemInCart;
        const quantity = isItemInCart ? 1 : 0;

        return {
          ...product,
          quantity,
          isItemInCart,
        };
      }

      return product;
    });

    setCart(items);
  };

  const setCart = (products) => {
    const cart = products.filter((product) => product.isItemInCart);

    dispatch(cartActions.setCart(cart));
  };

  const clearCart = () => {
    dispatch(cartActions.setCart([]));
  };

  return {
    setCart,
    toggleAddToCart,
    handleMinusClick,
    handlePlusClick,
    clearCart,
  };
};

export { useCart };
