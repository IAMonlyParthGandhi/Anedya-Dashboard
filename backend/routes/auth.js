const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

router.post('/logout', authController.logout);

module.exports = router;
