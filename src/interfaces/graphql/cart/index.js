const cartItems = require('./cartItems');
const cart = require('./cart-queries');

module.exports = {
  ...cartItems,
  cartQueries: cart,
}