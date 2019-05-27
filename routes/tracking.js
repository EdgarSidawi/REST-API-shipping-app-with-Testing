const express = require('express');
const { body } = require('express-validator/check');

const trackingController = require('../controllers/tracking');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  '/tracking',
  [
    body('trackingNumber')
      .trim()
      .isLength({ min: 10 })
  ],
  trackingController.postTracking
);

router.get('/profile/:userId', isAuth, trackingController.getProfile);

module.exports = router;
