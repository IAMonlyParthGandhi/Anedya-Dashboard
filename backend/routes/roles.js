const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Role } = require('../models');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
