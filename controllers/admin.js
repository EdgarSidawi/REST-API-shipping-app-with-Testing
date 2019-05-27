const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const Client = require('../models/client');
const Tracking = require('../models/tracking');

exports.postCreate = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error('Entered information is incorrect!');
    error.statusCode = 422;
    throw error;
  }

  const senderFirstName = req.body.senderFirstName;
  const senderLastName = req.body.senderLastName;
  const senderUsername = req.body.senderUsername;
  const senderPassword = req.body.senderPassword;
  const recipientFirstName = req.body.recipientFirstName;
  const recipientLastName = req.body.recipientLastName;
  const recipientAddress = req.body.recipientAddress;
  const item = req.body.item;
  const dateOfShipment = req.body.dateOfShipment;
  const estimatedDeliveryDate = req.body.estimatedDeliveryDate;
  const trackingNumber = req.body.trackingNumber;

  let resultId = null;
  const tracking = new Tracking({
    trackingNumber: trackingNumber,
    actionRequired: false,
    currentStatus: null
  });
  tracking
    .save()
    .then(result => {
      if (!result) {
        const error = new Error('Creating Tracking Information failed');
        error.statusCode = 422;
        throw error;
      }
      resultId = result._id;
      // console.log('resultId.toString: ', resultId.toString());
      bcrypt
        .hash(senderPassword, 12)
        .then(hashedPw => {
          const client = new Client({
            clientUsername: senderUsername,
            clientPassword: hashedPw,
            clientFirstName: senderFirstName,
            clientLastName: senderLastName,
            recipientFirstName: recipientFirstName,
            recipientLastName: recipientLastName,
            recipientAddress: recipientAddress,
            item: item,
            dateOfShipment: dateOfShipment,
            estimatedDeliveryDate: estimatedDeliveryDate,
            trackingId: resultId.toString(),
            trackingNumber: trackingNumber,
            tracking: resultId
          });
          client
            .save()
            .then(data => {
              if (!data) {
                const error = new Error('Entered Client Information failed!');
                error.statusCode = 422;
                throw error;
              }
              res.status(201).json({
                message: 'Information Created Successfully'
              });
            })
            .catch(err => {
              err.statusCode = 422;
              next(err);
            });
        })
        .catch(err => {
          err.statusCode = 422;
          next(err);
        });
    })
    .catch(err => {
      err.statusCode = 422;
      next(err);
    });
};

exports.getTrackings = (req, res, next) => {
  Client.find()
    .populate('tracking')
    // .execPopulate()
    .then(result => {
      if (!result) {
        const error = new Error('No Tracking Information Found');
        error.statusCode = 422;
        throw error;
      }
      // console.log('result: ', result);
      res.status(200).json({
        result: result
      });
    })
    .catch(err => {
      err.statusCode = 422;
      next(err);
    });
};

exports.getTracking = (req, res, next) => {
  const trackingId = req.params.trackingId;
  Client.findOne({ tracking: trackingId })
    .then(result => {
      if (!result) {
        const error = new Error('No Tracking Information Found');
        error.statusCode = 422;
        throw error;
      }
      // console.log('result: ', result);
      res.status(200).json({
        result: result
      });
    })
    .catch(err => {
      err.statusCode = 422;
      next(err);
    });
};

exports.putUpdate = (req, res, next) => {
  const id = req.body.id;
  const senderFirstName = req.body.senderFirstName;
  const senderLastName = req.body.senderLastName;
  const senderUsername = req.body.senderUsername;
  let senderPassword = req.body.senderPassword;
  const recipientFirstName = req.body.recipientFirstName;
  const recipientLastName = req.body.recipientLastName;
  const recipientAddress = req.body.recipientAddress;
  const item = req.body.item;
  const dateOfShipment = req.body.dateOfShipment;
  const estimatedDeliveryDate = req.body.estimatedDeliveryDate;

  bcrypt.hash(senderPassword, 12).then(hashedPw => {
    Client.findById(id)
      .then(result => {
        result.clientFirstName = senderFirstName;
        result.clientLastName = senderLastName;
        result.clientUsername = senderUsername;
        if (senderPassword !== '') {
          // console.log('senderPassword: ', senderPassword);
          // console.log('hashedPassword: ', hashedPw);
          result.clientPassword = hashedPw;
        }
        result.recipientFirstName = recipientFirstName;
        result.recipientLastName = recipientLastName;
        result.recipientAddress = recipientAddress;
        result.item = item;
        result.dateOfShipment = dateOfShipment;
        result.estimatedDeliveryDate = estimatedDeliveryDate;

        return result.save();
      })
      .then(result => {
        if (!result) {
          const error = new Error('Profile Update Failed');
          error.statusCode = 422;
          throw error;
        }
        res.status(201).json({
          message: 'Profile Update Successful'
        });
      })
      .catch(err => {
        statusCode = 422;
        next(err);
      });
  });
};

exports.putTracking = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error(
      'Entered information is incorrect. Please fill all the form'
    );
    error.statusCode = 422;
    throw error;
  }

  const updatedOn = req.body.updatedOn;
  const location = req.body.location;
  const currentStatus = req.body.currentStatus;
  const time = req.body.time;
  const trackingNumber = req.body.trackingNumber;

  Tracking.findOne({ trackingNumber: trackingNumber })
    .then(result => {
      result.currentStatus = currentStatus;
      result.trackingInfo.push({
        updatedOn: updatedOn,
        location: location,
        currentStatus: currentStatus,
        time: time
      });
      return result.save();
    })
    .then(result => {
      if (!result) {
        const error = new Error('Updating tracking information failed');
        error.statusCode = 422;
        throw error;
      }
      res.status(201).json({
        message: 'Tracking Updated Successfully'
      });
    })
    .catch(err => {
      statusCode = 422;
      next(err);
    });
};

exports.deleteTracking = (req, res, next) => {
  const trackingId = req.params.trackingId;

  Client.findOneAndDelete({ tracking: trackingId })
    .then(result => {
      if (!result) {
        const error = new Error('Deleting failed, Information not available');
        error.statusCode = 422;
        throw error;
      }
      return Tracking.findByIdAndDelete(trackingId);
    })
    .then(result => {
      if (!result) {
        const error = new Error('Deleting failed, Information not available');
        error.statusCode = 422;
        throw error;
      }
      res.status(201).json({
        message: 'Information deleted successfully'
      });
    })
    .catch(err => {
      statusCode = 422;
      next(err);
    });
};

exports.putAction = (req, res, next) => {
  const trackingId = req.body.trackingId;
  const actionRequired = req.body.actionRequired;

  Tracking.findById(trackingId)
    .then(result => {
      if (!result) {
        const error = new Error('Tracking Number does not exist');
        error.statusCode = 422;
        throw error;
      }
      result.actionRequired = actionRequired;
      return result.save();
    })
    .then(result => {
      if (!result) {
        const error = new Error('Action Update failed');
        error.statusCode = 422;
        throw error;
      }
      res.status(201).json({
        message: 'Action Required Updated Successfully'
      });
    })
    .catch(err => {
      statusCode = 422;
      next(err);
    });
};
