const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentTypesEnum = ['Credit Card'];
const PaymentCardType = ['Visa', 'Master'];
const PaymentStatuses = ['Waiting Payment', 'Paid', 'Refused'];
const CurrencySchema = new Schema({
  paymentType: {
    type: String,
    enum: PaymentTypesEnum,
    default: PaymentTypesEnum[0]
  },
  paymentCardType: {
    type: String,
    enum: PaymentCardType,
    default: PaymentCardType[0]
  },
  paymentStatus: {
    type: String,
    enum: PaymentStatuses,
    default: PaymentStatuses[0]
  },
  transactionId: {
    type: String,
    default: '2312213312XXXTD',
  }
});

module.exports = CurrencySchema;