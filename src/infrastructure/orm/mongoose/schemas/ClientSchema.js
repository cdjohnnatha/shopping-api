const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClientSchema = new Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  birthDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Client', ClientSchema);
