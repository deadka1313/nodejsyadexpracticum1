import { NextFunction, Response, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import CustomError from '../errors/CustomError';

const { JWT_SECRET_KEY } = process.env;

interface ICookiesAuth {
  JWT: string;
}
interface IAuthReq extends Request<ICookiesAuth> {
  user?: string | JwtPayload
}

// eslint-disable-next-line consistent-return
const authMiddleware = async (req: IAuthReq, res: Response, next: NextFunction) => {
  const token = req.cookies.JWT || '';

  if (!token) {
    return next(CustomError.Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY as string);
  } catch (err) {
    return next(CustomError.Unauthorized('Необходима авторизация'));
  }
  req.user = payload as { _id: JwtPayload};
  next();
};

export default authMiddleware;
