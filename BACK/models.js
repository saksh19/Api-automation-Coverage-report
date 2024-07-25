import { Sequelize, DataTypes } from 'sequelize';

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
});

export { sequelize, User };
