const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');

const router = express.Router();

router.put(
  '/create',
  [
    body('senderFirstName')
      .trim()
      .isLength({ min: 2 }),

    body('senderLastName')
      .trim()
      .isLength({ min: 2 }),

    body('senderUsername')
      .trim()
      .isLength({ min: 2 }),

    body('senderPassword')
      .trim()
      .isLength({ min: 2 }),

    body('recipientFirstName')
      .trim()
      .isLength({ min: 2 }),

    body('recipientLastName')
      .trim()
      .isLength({ min: 2 }),

    body('recipientAddress')
      .trim()
      .isLength({ min: 2 })
  ],
  adminController.postCreate
);

router.get('/tracking', adminController.getTrackings);
router.get('/tracking/:trackingId', adminController.getTracking);
router.put(
  '/tracking',
  [
    body('updatedOn')
      .trim()
      .isLength({ min: 2 }),
    body('location')
      .trim()
      .isLength({ min: 2 }),
    body('currentStatus')
      .trim()
      .isLength({ min: 2 }),
    body('time')
      .trim()
      .isLength({ min: 2 })
  ],
  adminController.putTracking
);
router.put('/update', adminController.putUpdate);
router.delete('/tracking/:trackingId', adminController.deleteTracking);
router.put('/action', adminController.putAction);

module.exports = router;
