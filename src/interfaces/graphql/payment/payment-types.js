const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLString,
} = require('graphql');

const PaymentTypesEnum = new GraphQLEnumType({
  name: 'PaymentTypesEnum',
  description: 'Payment types.',
  values: {
    CREDIT_CARD: { value: 'Credit Card' },
  },
});

const PaymentCardEnumType = new GraphQLEnumType({
  name: 'PaymentCardEnumType',
  description: 'Payment types.',
  values: {
    MASTER: { value: 'Master' },
    VISA: { value: 'Visa' },
  },
});
const PaymentStatusEnumType = new GraphQLEnumType({
  name: 'PaymentStatusEnumType',
  description: 'Payment status types.',
  values: {
    PAID: { value: 'Paid' },
    REFUSED: { value: 'Refused' },
  },
});


const PaymentType = new GraphQLObjectType({
  name: 'PaymentType',
  description: 'Payment type used in order.',
  fields: {
    paymentType: { type: GraphQLNonNull(PaymentTypesEnum) },
    paymentCardType: { type: GraphQLNonNull(PaymentCardEnumType) },
    paymentStatus: { type: GraphQLNonNull(PaymentStatusEnumType) },
    transactionId: { type: GraphQLList(GraphQLString) },
  }
});

module.exports = {
  PaymentTypesEnum,
  PaymentCardEnumType,
  PaymentStatusEnumType,
  PaymentType,
};
