const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, is_active: true },
      include: [{
        model: Role,
        include: [Permission]
      }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const permissions = user.Role.Permissions.map(p => p.name);

    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: user.Role.name,
      permissions
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    return res.status(200).json({
      token,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.Role.name,
        permissions
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = (req, res) => {
  return res.status(200).json({ message: 'Logged out' });
};

module.exports = {
  login,
  logout
};
