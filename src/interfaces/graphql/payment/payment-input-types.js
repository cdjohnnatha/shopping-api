const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require('graphql');

const { PaymentCardEnumType, PaymentTypesEnum } = require('./payment-types');

const PaymentInputType = new GraphQLInputObjectType({
  name: 'PaymentInputType',
  description: 'Cart item input used increase or decrease a product in a cart.',
  fields: {
    paymentCard: { type: GraphQLNonNull(PaymentCardEnumType) },
    paymentType: { type: GraphQLNonNull(PaymentTypesEnum) },
    creditCardNumber: { type: GraphQLNonNull(GraphQLString) },
  },
});

module.exports = {
  PaymentInputType,
};
