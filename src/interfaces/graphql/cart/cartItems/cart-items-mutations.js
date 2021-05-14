/* eslint-disable no-else-return */
const { GraphQLID, GraphQLNonNull } = require('graphql');
const {
  AddCartItemResolver,
  UpdateCartItemQuantityResolver,
  RemoveCartItemResolver,
} = require('./cart-items-resolvers');
const { AddCartItemInputType, UpdateCartItemQuantityInputType } = require('./cart-items-input-types');
const { CartType } = require('../cart-types');
const { authorization } = require('../../authorization');

const cartItemMutations = {
  addCartItem: {
    type: CartType,
    description: 'Method used to add a product in a cart.',
    args: {
      cartItem: {
        type: AddCartItemInputType,
      },
    },
    resolve: (obj, args, context) => authorization(AddCartItemResolver, {
      obj,
      args,
      context,
    }),
  },
  updateCartItemQuantity: {
    type: CartType,
    description: 'Method used to update cart item quantity, increase/decrease.',
    args: {
      cartItem: {
        type: UpdateCartItemQuantityInputType,
      },
    },
    resolve: (obj, args, context) => authorization(UpdateCartItemQuantityResolver, {
      obj,
      args,
      context,
    }),
  },
  removeCartItem: {
    type: CartType,
    description: 'Method used to update cart item quantity, increase/decrease.',
    args: {
      productId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: (obj, args, context) => authorization(RemoveCartItemResolver, {
      obj,
      args,
      context,
    }),
  },
};

module.exports = cartItemMutations;
