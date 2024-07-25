// import { Sequelize, DataTypes } from 'sequelize';

// // Define the User model in this file or import it from another file
// const sequelize = new Sequelize('Mydatabase', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'mysql',
//   port: 3306
// });

// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
// });

// async function insertToDatabase({ name, email, password }) {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');

//     // Sync the model (you might want to do this in a separate migration script in production)
//     await User.sync();

//     // Create a new user
//     const user = await User.create({
//       name,
//       email,
//       password // Directly use hashedPassword
//     });

//     console.log('User created:', user);
//   } catch (error) {
//     console.error('Unable to connect to the database or create user:', error);
//   }
// }

// export default insertToDatabase;


// async function retrieve() {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');

//     // Sync the model (you might want to do this in a separate migration script in production)
//     await User.sync();

//     const users = await User.findAll();
//     console.log('Users:', users);
//     return users;
//   } catch (error) {
//     console.error('Error fetching users:', error);
//   } finally {
//     await sequelize.close();
//   }
// }

// export { retrieve };