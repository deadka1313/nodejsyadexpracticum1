import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import errorHandler from './middlewares/errors';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.user = {
    _id: '656076770dc0c58045f9b186', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', router);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`App listening on port ${PORT}`);
});
