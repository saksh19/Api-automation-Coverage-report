import { sequelize, User } from './models.js';

async function insertToDatabase({ name, email, password}) {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await User.sync();

    const user = await User.create({
      name,
      email,
      password,
      refreshToken: null,
    });

    const createdUser = await User.findByPk(user.id, {
      attributes: ['name', 'email'] 
    });

    console.log('User created:', createdUser);

    return createdUser
  } catch (error) {
    console.error('Unable to connect to the database or create user:', error);
    return error
  }
}

async function retrieve({email}) {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await User.sync();

  
    const users = await User.findOne({email: email})
    console.log('Users from line 38:', users);
    return users
  
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function Authentication({id,refreshToken}) {
   console.log("id is---------------------------->",id)
   console.log("refreshToken is---------------------->",refreshToken);
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await User.sync();

    
    const users = await User.findByPk(id)
    users.refreshToken = refreshToken;
    await users.save();
    
    return "User valid"
  
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

export { insertToDatabase, retrieve,Authentication };
    