const express = require('express');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.post(
  '/login',
  [
    body('username')
      .trim()
      .isLength({ min: 2 }),
    body('password')
      .trim()
      .isLength({ min: 2 })
  ],
  authController.postLogin
);

module.exports = router;
