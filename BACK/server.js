import express from 'express';
import { insertToDatabase, retrieve } from './databaseOperations.js';
import 'dotenv/config';
import CORS from "cors"

const app = express();
const port = 5000;

app.use(express.json());
app.use(CORS)

// Define routes and handlers
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await insertToDatabase({ name, email, password });
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await retrieve();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users');
  }
});

// Gracefully shut down the server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  console.log('Closing database connection...');
  await sequelize.close();
  console.log('Database connection closed.');
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0);
  });
});
