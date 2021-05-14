/* eslint-disable no-else-return */
const { cartCheckoutResolver } = require('./cart-resolvers');
const { OrderType } = require('../order/order-types');
const { PaymentInputType } = require('../payment/payment-input-types');
const { authorization } = require('../authorization');

const cartMutations = {
  checkout: {
    type: OrderType,
    args: {
      payment: {
        type: PaymentInputType,
      },
    },
    description: 'Method used to purchase items from cart.',
    resolve: (obj, args, context) => authorization(cartCheckoutResolver, {
      obj,
      args,
      context,
    }),
  },
};

module.exports = cartMutations;
