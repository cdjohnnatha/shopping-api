/* eslint-disable no-else-return */
const { GraphQLID, GraphQLNonNull } = require('graphql');
const {
  AddCartItemResolver,
  UpdateCartItemQuantityResolver,
  RemoveCartItemResolver,
} = require('./cart-items-resolvers');
const { AddCartItemInputType, UpdateCartItemQuantityInputType } = require('./cart-items-input-types');
const { CartType } = require('../cart-types');

const cartItemMutations = {
  addCartItem: {
    type: CartType,
    description: 'Method used to add a product in a cart.',
    args: {
      cartItem: {
        type: AddCartItemInputType,
      },
    },
    resolve: AddCartItemResolver,
  },
  updateCartItemQuantity: {
    type: CartType,
    description: 'Method used to update cart item quantity, increase/decrease.',
    args: {
      cartItem: {
        type: UpdateCartItemQuantityInputType,
      },
    },
    resolve: UpdateCartItemQuantityResolver,
  },
  removeCartItem: {
    type: CartType,
    description: 'Method used to update cart item quantity, increase/decrease.',
    args: {
      productId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: RemoveCartItemResolver,
  },
};

module.exports = cartItemMutations;
