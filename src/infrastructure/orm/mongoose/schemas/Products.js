const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductImageSchema = require('./ProductImages');
const CurrencySchema = require('./CurrencySchema');

const ProductSchema = new Schema({
  name:  {
    type: String,
    unique: true
  },
  quantityAvailable: {
    type: Number,
    min: [0, 'minimum allowed is 0'],
  },
  maxQuantityPerCustomer: {
    type: Number,
    min: [1, 'minimum allowed is 1'],
  },
  category:   String,
  description: String,
  price: {
    type: Number,
    min: [0, 'minimum allowed is 0'],
  },
  images: [ProductImageSchema],
  currency: CurrencySchema,
  in_carts: {
    quantity: Number,
    clientId: String,
    timestamp: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: {
    type: Date,
    default: null,
  },
});


module.exports = mongoose.model('Product', ProductSchema);;