import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Button, Form, Container, Row, Col } from 'reactstrap';

import { DashboardLayout } from 'components/common/Layout';
import { InputField } from 'components/common/InputField';

import { createProduct } from 'services/marketplace';

const CreateProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    media: null,
    isPhysicalProduct: true,
    weight: '',
    quantity: '',
  });
  const [disableSubmit, setDisableSubmit] = useState(true);
  const history = useHistory();
  const match = useRouteMatch();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(product);

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
            <h2>Create Product</h2>
            {/* TODO: merge this with EditShopifyProduct*/}
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

export default CreateProduct;
