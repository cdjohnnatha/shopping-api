const mongoose = require('mongoose');
const { Schema } = mongoose;

const CurrencySchema = new Schema({
  name: String,
  label: String,
});

module.exports = CurrencySchema;