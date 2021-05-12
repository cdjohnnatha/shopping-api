/* eslint-disable no-else-return */
const { activeCartResolver } = require('./cart-resolvers');
const { CartType } = require('./cart-types');

const cartQueries = {
  activeCart: {
    type: CartType,
    description: 'Method used to add a product in a cart.',
    resolve: activeCartResolver,
  },
};

module.exports = cartQueries;
