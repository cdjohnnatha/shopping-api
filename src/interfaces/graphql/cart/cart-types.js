const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType
} = require('graphql');

const { ProductType } = require('../products/product-types');

const CartStatusEnumType = new GraphQLEnumType({
  name: 'CartStatusEnumType',
  description: 'Cart status definition.',
  values: {
    ACTIVE: { value: 'ACTIVE' },
    INACTIVE: { value: 'INACTIVE' },
  },
});


const CartType = new GraphQLObjectType({
  name: 'CartType',
  description: 'Attributes definition for a cart with/without products.',
  fields: {
    _id: { type: GraphQLID },
    quantity: { type: GraphQLNonNull(GraphQLInt) },
    total: { type: GraphQLNonNull(GraphQLFloat) },
    status: { type: GraphQLNonNull(CartStatusEnumType) },
    products: { type: GraphQLList(ProductType) },
  }
});


module.exports = {
  CartType,
  CartStatusEnumType,
}