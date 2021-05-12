const mongoose = require('mongoose');
const { Schema } = mongoose;
const PaymentTypeSchema = require('./PaymentTypeSchema');
const ProductsSchema = require('./Products');

const OrderSchema = new Schema({
  clientId: { type: String, required: true },
  cartId: { type: String, required: true },
  payment: PaymentTypeSchema,
  products: [ProductsSchema.schema],
  total: { type: Number, default: 0.00 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Order', OrderSchema);
