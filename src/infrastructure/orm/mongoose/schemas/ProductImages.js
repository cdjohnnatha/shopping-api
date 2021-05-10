const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductImageSchema = new Schema({
  path: String,
  tags: String,
  size: String,
  type: String,
});

module.exports = ProductImageSchema;