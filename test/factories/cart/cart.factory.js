/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const { commerce, datatype } = require('faker');
const CartSchema = require('../../../src/infrastructure/orm/mongoose/schemas/CartSchema');

const CartFactory = (factory, clientId) =>
  factory.define('Cart', CartSchema, async (buildOptions) => {
    let attrs = {
      clientId: clientId,
      status: 'Active',
      products: [],
      quantity: 0,
      total: 0,
    };

    if (buildOptions.attachProduct) {
      attrs.quantity = buildOptions.attachProduct.length;
      for (const productAttached of buildOptions.attachProduct) {
        attrs.total += productAttached.price;
        attrs.products.push({
          productId: `${productAttached._id}`,
          quantity: 1,
          price: productAttached.price,
        });
      }
    }

    return attrs;
  });

module.exports = CartFactory;
