const CartModel = require('../schemas/CartSchema');

const cartSeeder = async () => {
  const client = {
    clientId: '6099cd86f1dd766242d7ff2b',
    status: 'Active',
    products: [],
    quantity: 0,
  };

  return CartModel.create(client);
};

module.exports = cartSeeder;
