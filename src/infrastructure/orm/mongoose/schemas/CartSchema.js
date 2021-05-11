const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = require('./CartItemSchema');

const EnabledDisabledEnumValues = ['Active', 'Expired', 'Completed', 'Canceled'];
const CartSchema = new Schema({
  clientId: { type: String, required: true },
  status: {
    type: String,
    enum: EnabledDisabledEnumValues,
    default: EnabledDisabledEnumValues[0]
  },
  products: [CartItemSchema],
  quantity: {
    type: Number,
    min: [0, 'minimum allowed is 0'],
  },
  total: { type: Number, default: 0.00 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: {
    type: Date,
    default: null,
  },
});

// CartSchema.index({ cliendId, status });

module.exports = mongoose.model('Cart', CartSchema);;