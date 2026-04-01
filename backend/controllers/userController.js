const { User, Role } = require('../models');
const { validationResult } = require('express-validator');

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password, first_name, last_name, roleId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const newUser = await User.create({
      email,
      password_hash: password,
      first_name,
      last_name,
      role_id: roleId,
      is_active: true
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password_hash;

    return res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Role, attributes: ['name'] }]
    });
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { first_name, last_name, role_id, is_active } = req.body;

    await user.update({
      first_name: first_name !== undefined ? first_name : user.first_name,
      last_name: last_name !== undefined ? last_name : user.last_name,
      role_id: role_id !== undefined ? role_id : user.role_id,
      is_active: is_active !== undefined ? is_active : user.is_active
    });

    return res.status(200).json({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ is_active: false });
    return res.status(200).json({ message: 'User deactivated' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deactivateUser
};
