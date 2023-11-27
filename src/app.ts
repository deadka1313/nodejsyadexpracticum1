import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import router from './routes/index';
import errorHandler from './middlewares/errors';
import { createUser, login } from './controllers/users';
import authMiddleware from './middlewares/auth';
import logger from './middlewares/logger';
import { createUserValidation, loginUserValidation } from './validation/userValidation';

const { PORT = 3000, DATABASE = 'mongodb://127.0.0.1:27017/mestodb', CLIENT_URL = 'http://localhost:3001' } = process.env;
const app = express();

app.use(cors({ credentials: true, allowedHeaders: ['Content-Type', 'Authorization'], origin: CLIENT_URL }));

app.use(express.json());
app.use(logger.requestLogger);

app.use(cookieParser());
app.use('/signin', loginUserValidation, login);
app.use('/signup', createUserValidation, createUser);
app.use(authMiddleware);
app.use('/', router);

app.use(logger.errorLogger);
app.use(errors());
app.use(errorHandler);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DATABASE);

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

connect();
