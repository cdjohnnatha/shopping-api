const cartItems = require('./cartItems');
const cart = require('./cart-queries');
const cartMutations = require('./cart-mutations');

module.exports = {
  ...cartItems,
  cartQueries: cart,
  cartMutations,
}