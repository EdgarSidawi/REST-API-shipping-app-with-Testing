const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trackingSchema = new Schema({
  trackingNumber: {
    type: String,
    required: true
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  currentStatus: {
    type: String,
    default: null
  },
  trackingInfo: [
    {
      updatedOn: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      currentStatus: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('Tracking', trackingSchema);
