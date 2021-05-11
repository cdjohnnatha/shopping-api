const {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLEnumType,
} = require('graphql');

const { ProductType } = require('../../products/product-types');

const CartStatusEnumType = new GraphQLEnumType({
  name: 'CartStatusEnumType',
  description: 'Cart status definition.',
  values: {
    ACTIVE: { value: 'ACTIVE' },
    INACTIVE: { value: 'INACTIVE' },
  },
});


const AddCartItemInputType = new GraphQLInputObjectType({
  name: 'addItemInputType',
  description: 'Attributes definition for a cart with/without products.',
  fields: {
    productId: { type: GraphQLNonNull(GraphQLID) },
  }
});
const UpdateCartItemQuantityInputType = new GraphQLInputObjectType({
  name: 'updateCartItemQuantityInputType',
  description: 'Cart item input used increase or decrease a product in a cart.',
  fields: {
    productId: { type: GraphQLNonNull(GraphQLID) },
    cartId: { type: GraphQLNonNull(GraphQLID) },
    quantity: { type: GraphQLNonNull(GraphQLInt) },
  }
});


module.exports = {
  AddCartItemInputType,
  UpdateCartItemQuantityInputType,
  CartStatusEnumType,
}