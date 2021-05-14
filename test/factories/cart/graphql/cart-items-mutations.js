const { mutationString } = require('../../../support/graphql-helpers');
const { CartFieldsType } = require('./cart-types');
const { OrderFieldsTypes } = require('../../order/graphql/order-types');

const addCartItemMutation = (input, responseObjects) => {
  let queryResponse = responseObjects;
  if (!queryResponse) {
    queryResponse = `
        ${CartFieldsType}
    `;
  }
  return mutationString('addCartItem', input, queryResponse);
};

const removeCartItemMutation = (input, responseObjects) => {
  let queryResponse = responseObjects;
  if (!queryResponse) {
    queryResponse = `
        ${CartFieldsType}
    `;
  }
  return mutationString('removeCartItem', input, queryResponse);
};

const updateCartItemQuantityMutation = (input, responseObjects) => {
  let queryResponse = responseObjects;
  if (!queryResponse) {
    queryResponse = `
        ${CartFieldsType}
    `;
  }
  return mutationString('updateCartItemQuantity', input, queryResponse);
};

const checkoutMutation = (input, responseObjects) => {
  let queryResponse = responseObjects;
  if (!queryResponse) {
    queryResponse = `
        ${OrderFieldsTypes}
    `;
  }
  return mutationString('checkout', input, queryResponse);
};

module.exports = {
  addCartItemMutation,
  removeCartItemMutation,
  updateCartItemQuantityMutation,
  checkoutMutation,
}