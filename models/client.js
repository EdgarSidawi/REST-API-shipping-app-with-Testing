const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  clientUsername: {
    type: String,
    required: true
  },
  clientPassword: {
    type: String,
    required: true
  },
  clientFirstName: {
    type: String,
    required: true
  },
  clientLastName: {
    type: String,
    required: true
  },
  recipientFirstName: {
    type: String
  },
  recipientLastName: {
    type: String
  },
  recipientAddress: {
    type: String
  },
  item: {
    type: String
  },
  dateOfShipment: {
    type: String
  },
  estimatedDeliveryDate: {
    type: String
  },
  trackingId: {
    type: String
  },
  trackingNumber: {
    type: String
  },
  tracking: {
    type: Schema.Types.ObjectId,
    ref: 'Tracking'
  }
});

module.exports = mongoose.model('Client', clientSchema);
