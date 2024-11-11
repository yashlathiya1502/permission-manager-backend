import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import userRoute from './routes/user.route.js'
import roleRoute from './routes/role.route.js'

app.use('/api/user', userRoute);
app.use('/api/role', roleRoute);

export default app;