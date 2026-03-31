const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');

// Associations
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

Role.belongsToMany(Permission, { 
  through: 'role_permissions', 
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  timestamps: false
});

Permission.belongsToMany(Role, { 
  through: 'role_permissions', 
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  timestamps: false
});

module.exports = {
  sequelize,
  User,
  Role,
  Permission
};
