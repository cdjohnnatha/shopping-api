const mongoose = require('mongoose');
const { Schema } = mongoose;

const CurrencySchema = require('./CurrencySchema');

const CartItemSchema = new Schema({
  productId:  {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    min: [0, 'minimum allowed is 0'],
  },
  price: {
    type: Number,
    min: [0, 'minimum allowed is 0'],
  },
  currency: CurrencySchema,
});


module.exports = CartItemSchema;