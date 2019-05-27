const { validationResult } = require('express-validator/check');
const Tracking = require('../models/tracking');
const Client = require('../models/client');

exports.postTracking = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Entered information is incorrect!');
    error.statusCode = 422;
    throw error;
  }

  const trackingNumber = req.body.trackingNumber;

  return Tracking.findOne({ trackingNumber: trackingNumber })
    .then(result => {
      if (!result) {
        const error = new Error('Information does not exist');
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({
        tracking: result.trackingInfo,
        actionRequired: result.actionRequired
      });
      return result;
    })
    .catch(err => {
      err.statusCode = 422;
      next(err);
      return err;
    });
};

exports.getProfile = (req, res, next) => {
  const userId = req.params.userId;

  return Client.findById(userId)
    .populate('tracking')
    .then(result => {
      if (!result) {
        const error = new Error('Information does not exist');
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({
        result: result
      });
      return result;
    })
    .catch(err => {
      err.statusCode = 422;
      next(err);
      return err;
    });
};
