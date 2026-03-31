const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  resource: {
    type: DataTypes.STRING(50)
  },
  action: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'permissions',
  timestamps: false,
  underscored: true
});

module.exports = Permission;
