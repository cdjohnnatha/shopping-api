const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString
} = require('graphql');

const CartItemType = new GraphQLObjectType({
  name: 'CartItemType',
  description: 'Attributes definition for a product.',
  fields: {
    name: { type: GraphQLNonNull(GraphQLString) },
    productId: { type: GraphQLNonNull(GraphQLID) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    quantity: { type: GraphQLNonNull(GraphQLInt) },
  }
});

module.exports = {
  CartItemType,
};
