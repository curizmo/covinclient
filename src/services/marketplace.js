import { BEApi } from './api';

/**
 * @param {object} product
 * @returns {Promise<object>}
 */
export function createProduct(product) {
  const {
    title,
    media,
    description,
    price,
    isPhysicalProduct,
    weight,
    quantity,
  } = product;

  const form = new FormData();

  form.append('title', title);
  form.append('media', media);
  form.append('description', description);
  form.append('price', price);
  form.append('isPhysicalProduct', isPhysicalProduct);
  form.append('weight', weight);
  form.append('quantity', quantity);

  return BEApi.post('/marketplace', form, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

/**
 * @param {object} product
 * @returns {Promise<object>}
 */
export function editProduct(productId, organizationId, product) {
  const {
    id,
    title,
    media,
    description,
    price,
    isPhysicalProduct,
    weight,
    quantity,
  } = product;

  const form = new FormData();

  form.append('id', id);
  form.append('title', title);
  form.append('media', media);
  form.append('description', description);
  form.append('price', price);
  form.append('isPhysicalProduct', isPhysicalProduct);
  form.append('weight', weight);
  form.append('quantity', quantity);

  return BEApi.put(
    `/marketplace/organization/${organizationId}/product/${productId}`,
    form,
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
}

export function getProduct(organizationId, productId) {
  return BEApi.get(
    `/marketplace/organization/${organizationId}/product/${productId}`,
  );
}

export function removeProduct(organizationId, productId) {
  return BEApi.delete(
    `/marketplace/organization/${organizationId}/product/${productId}`,
  );
}

export function getProducts(organizationId) {
  return BEApi.get(`/marketplace/organization/${organizationId}`);
}

export function createShopifyCheckout(cart) {
  return BEApi.post('/marketplace/checkout', {
    cart,
  });
}
