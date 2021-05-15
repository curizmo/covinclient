import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Button, Form, Container, Row, Col } from 'reactstrap';

import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';

import { editProduct, getProduct } from 'services/marketplace';

const EditProduct = () => {
  const [product, setProduct] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    media: null,
    isPhysicalProduct: true,
    weight: '',
    quantity: '',
  });
  const [disableSubmit, setDisableSubmit] = useState(false);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    fetchProduct(match.params.organizationId, match.params.productId);
  }, [match.params.organizationId, match.params.productId]);

  const fetchProduct = async (organizationId, productId) => {
    try {
      const response = await getProduct(organizationId, productId);

      const { id, title, body_html, variants, image } = response.data.product;
      const product = {
        id,
        title,
        description: body_html,
        price: variants[0].price,
        media: image,
        isPhysicalProduct: variants[0].requires_shipping,
        weight: variants[0].weight,
        quantity: variants[0].inventory_quantity,
      };

      setProduct(product);
    } catch (e) {
      // TODO: Handle error
    }
  };
  const handleChange = (e) => {
    const newProduct = {
      ...product,
      [e.target.name]: e.target.value,
    };

    setProduct(newProduct);
    validateForm(newProduct);
  };

  const handleIsPhysicalProductCheck = (e) => {
    const isPhysicalProduct = e.target.checked;
    const weight = '';

    const newProduct = {
      ...product,
      weight,
      isPhysicalProduct,
    };

    setProduct(newProduct);
    validateForm(newProduct);
  };

  const handleFileUpload = (e) => {
    const newProduct = {
      ...product,
      media: e.target.files[0],
    };

    setProduct(newProduct);
    validateForm(newProduct);
  };

  const handleSubmit = async () => {
    try {
      await editProduct(
        match.params.productId,
        match.params.organizationId,
        product,
      );

      history.push(`/clinic/${match.params.organizationId}/marketplace/manage`);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const validateForm = (product) => {
    const {
      title,
      description,
      price,
      isPhysicalProduct,
      weight,
      media,
      quantity,
    } = product;

    const disableSubmit = !(
      title &&
      description &&
      price &&
      (quantity === 0 || quantity) &&
      (!isPhysicalProduct || (isPhysicalProduct && weight)) &&
      media
    );

    setDisableSubmit(disableSubmit);
  };

  const { title, description, price, isPhysicalProduct, weight, quantity } =
    product;

  return (
    <DashboardLayout>
      <Container>
        <Row>
          <Col md="8">
            <h2>Edit Product</h2>
            {/* TODO: merge this with CreateShopifyProduct*/}
            <Form>
              <InputField
                title="Title"
                onChange={handleChange}
                value={title}
                name="title"
                type="text"
                placeholder="Title"
              />
              <InputField
                title="Description"
                onChange={handleChange}
                value={description}
                name="description"
                type="textarea"
                placeholder="Description"
              />
              <InputField
                title="Price"
                onChange={handleChange}
                value={price}
                name="price"
                type="number"
                min={0}
                placeholder="Price"
              />
              <InputField
                title="Media"
                name="media"
                type="file"
                onChange={handleFileUpload}
                placeholder="Media"
              />
              <InputField
                title="Is Physical Product?"
                onChange={handleIsPhysicalProductCheck}
                checked={isPhysicalProduct}
                name="isPhysicalProduct"
                type="checkbox"
                placeholder="Physical Product"
              />
              <InputField
                title="Weight"
                onChange={handleChange}
                value={weight}
                name="weight"
                type="number"
                min={0}
                disabled={!isPhysicalProduct}
                placeholder="Weight in kgs"
              />
              <InputField
                title="Quantity"
                onChange={handleChange}
                value={quantity}
                name="quantity"
                type="number"
                min={0}
                disabled={!isPhysicalProduct}
                placeholder="Quantity"
              />
              <Row>
                <Col md={{ size: 10, offset: 2 }}>
                  <Button
                    color="primary"
                    className={disableSubmit && 'disabled'}
                    onClick={handleSubmit}
                    disabled={disableSubmit}>
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default EditProduct;
