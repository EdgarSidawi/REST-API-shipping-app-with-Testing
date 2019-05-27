const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../models/client');

exports.postLogin = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error('Username or Password is not valid');
    error.statusCode = 422;
    throw error;
  }
  const username = req.body.username;
  const password = req.body.password;

  let loadedUser = null;
  Client.findOne({ clientUsername: username })
    .then(result => {
      if (!result) {
        const error = new Error('Username or Password is not valid');
        error.statusCode = 422;
        throw error;
      }
      loadedUser = result;

      return bcrypt.compare(password, result.clientPassword);
    })
    .then(doMatch => {
      if (!doMatch) {
        const error = new Error('Username or Password is not valid');
        error.statusCode = 422;
        throw error;
      }
      const token = jwt.sign(
        { userId: loadedUser._id.toString() },
        'somethingjustlikethisismyfavouritesong',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString()
      });
    })
    .catch(err => {
      err.statusCode = 422;
      next(err);
    });
};
