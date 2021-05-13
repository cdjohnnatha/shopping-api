const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const { PaymentType } = require('../payment/payment-types');
const { CartItemType } = require('../cart/cartItems/cart-items-types');


const OrderType = new GraphQLObjectType({
  name: 'OrderType',
  description: 'Attributes definition for a cart with/without products.',
  fields: {
    _id: { type: GraphQLNonNull(GraphQLID) },
    payment: { type: GraphQLNonNull(PaymentType) },
    products: { type: GraphQLNonNull(GraphQLList(CartItemType)) },
    total: { type: GraphQLNonNull(GraphQLFloat) },
  },
});

module.exports = {
  OrderType,
};
