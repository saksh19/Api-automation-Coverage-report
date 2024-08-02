import { Sequelize, DataTypes, json } from 'sequelize';
import jwt from 'jsonwebtoken'


const sequelize = new Sequelize('Mydatabase', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
    refreshToken: { // Add this field
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Api = sequelize.define('Api', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  covered: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Tested_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Test_name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Api',
  indexes: [
    {
      unique: true,
      fields: ['path', 'method']
    }
  ]
});

export { sequelize, User,Api };
