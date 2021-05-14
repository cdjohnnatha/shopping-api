const { CartItemType } = require('../../cart/graphql/cart-types');

const OrderFieldsTypes = `
  _id
  payment {
    paymentType
    paymentCardType
    paymentStatus
    transactionId
  }
  products {${CartItemType}}
  total
`;

module.exports = {
  OrderFieldsTypes,
}