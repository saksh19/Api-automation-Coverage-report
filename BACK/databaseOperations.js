import { sequelize, User } from './models.js';

async function insertToDatabase({ name, email, password }) {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await User.sync();

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log('User created:', user);
  } catch (error) {
    console.error('Unable to connect to the database or create user:', error);
  }
}

async function retrieve() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await User.sync();

    const users = await User.findAll();
    console.log('Users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

export { insertToDatabase, retrieve };
    