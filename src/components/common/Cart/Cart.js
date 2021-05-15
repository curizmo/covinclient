import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShoppingCart } from 'react-feather';
import {
  Badge,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import { getCart, getAmount } from '../../../selectors';

import { useCart } from '../../../hooks/useCart';

import { createShopifyCheckout } from 'services/marketplace';

const Cart = () => {
  const cart = useSelector(getCart);
  const totalAmount = useSelector(getAmount);
  const [displayCartModal, setDisplayCartModal] = useState(false);
  const { handlePlusClick, handleMinusClick, toggleAddToCart, clearCart } =
    useCart([]);

  useEffect(() => {
    if (!cart.length && displayCartModal) {
      setDisplayCartModal(false);
    }
  }, [cart, displayCartModal]);

  const handleCartClick = () => {
    if (!cart.length) {
      return;
    }

    setDisplayCartModal(!displayCartModal);
  };

  const closeCartModal = () => {
    setDisplayCartModal(false);
  };

  const handleCheckoutClick = async () => {
    try {
      const response = await createShopifyCheckout(cart);

      window.open(response.data.webUrl, '_blank');
      clearCart();
    } catch (err) {
      // TODO: Handle error
    }
  };

  return (
    <>
      <Button
        color="link"
        className={`btn-icon ${cart.length ? '' : 'pointer-events-none'}`}
        onClick={handleCartClick}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleCartClick();
          }
        }}
        role="button"
        tabIndex={0}>
        <ShoppingCart />
        <span>
          Cart
          {cart.length ? (
            <Badge color="danger" className="ml-1">
              {cart.length}
            </Badge>
          ) : null}
        </span>
      </Button>

      {displayCartModal && (
        <Modal isOpen={displayCartModal} toggle={closeCartModal}>
          <ModalHeader toggle={closeCartModal}>Cart</ModalHeader>
          <ModalBody>
            <Row>
              {cart.map((product) => {
                return (
                  <Col key={product.id} sm="6">
                    <Card className="flex w-1/2">
                      <CardImg
                        top
                        width="100%"
                        src={product.image.src}
                        alt={product.title}
                      />
                      <CardBody>
                        <CardTitle>{product.title}</CardTitle>
                        <CardSubtitle>{`$${product.price}`}</CardSubtitle>
                        <div className="mt-2">
                          <Button
                            size="sm"
                            onClick={() => toggleAddToCart(product)}
                            className="mr-2 mb-2">
                            Remove item
                          </Button>
                        </div>
                        {product.isItemInCart && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handlePlusClick(product)}>
                              +
                            </Button>
                            <span className="mx-2">{product.quantity}</span>
                            <Button
                              size="sm"
                              onClick={() => handleMinusClick(product)}>
                              -
                            </Button>
                          </>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="text-lg py-2">Total Amount: ${totalAmount}</div>
            <Button onClick={handleCheckoutClick}>Checkout</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
};

export { Cart };
