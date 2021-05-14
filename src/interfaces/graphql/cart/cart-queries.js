/* eslint-disable no-else-return */
const { activeCartResolver } = require('./cart-resolvers');
const { CartType } = require('./cart-types');
const { authorization } = require('../authorization');

const cartQueries = {
  activeCart: {
    type: CartType,
    description: 'Method used to add a product in a cart.',
    resolve: (obj, args, context) => authorization(activeCartResolver, {
      obj,
      args,
      context,
    }),
  },
};

module.exports = cartQueries;
