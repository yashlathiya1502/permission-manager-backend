import connectDB from './db/dbConnection.js';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('mongoDB connection failed !! ', err);
  });
