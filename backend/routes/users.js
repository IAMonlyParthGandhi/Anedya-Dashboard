const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const { createUser, getUsers, updateUser, deactivateUser } = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);
router.use(requirePermission('manage_users'));

router.post(
  '/',
  [
    body('email').isEmail().notEmpty(),
    body('password').isLength({ min: 8 }),
    body('roleId').isInt()
  ],
  createUser
);

router.get('/', getUsers);

router.put(
  '/:id',
  [
    body('role_id').optional().isInt()
  ],
  updateUser
);

router.delete('/:id', deactivateUser);

module.exports = router;
