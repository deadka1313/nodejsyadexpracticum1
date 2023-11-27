import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface IUser {
  _id: JwtPayload;
}

export interface IAuthReq extends Request {
  user?: IUser;
}
