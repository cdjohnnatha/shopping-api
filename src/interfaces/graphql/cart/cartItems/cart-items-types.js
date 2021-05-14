const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

const CartItemType = new GraphQLObjectType({
  name: 'CartItemType',
  description: 'Attributes definition for a product.',
  fields: {
    productId: { type: GraphQLNonNull(GraphQLID) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    quantity: { type: GraphQLNonNull(GraphQLInt) },
  }
});

module.exports = {
  CartItemType,
};
