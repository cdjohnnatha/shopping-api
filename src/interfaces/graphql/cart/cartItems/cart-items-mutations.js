/* eslint-disable no-else-return */
const { GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLList } = require('graphql');
const { ProductType } = require('../../products/product-types');
const { AddCartItemResolver, UpdateCartItemQuantityResolver } = require('./cart-items-resolvers');
const { AddCartItemInputType, UpdateCartItemQuantityInputType } = require('./cart-items-input-types');

const cartItemMutations = {
  addCartItemMutation: {
    type: GraphQLBoolean,
    description: 'Method used to add a product in a cart.',
    args: {
      cartItem: {
        type: AddCartItemInputType,
      },
    },
    resolve: AddCartItemResolver,
  },
  updateCartItemQuantityMutation: {
    type: GraphQLBoolean,
    description: 'Method used to update cart item quantity, increase/decrease.',
    args: {
      cartItem: {
        type: UpdateCartItemQuantityInputType,
      },
    },
    resolve: UpdateCartItemQuantityResolver,
  },
};

module.exports = cartItemMutations;
