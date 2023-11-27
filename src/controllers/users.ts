import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import HTTPStatus from 'http-status';
import User from '../models/user';
import CustomError from '../errors/CustomError';
import { IAuthReq } from '../utils/types';

const { JWT_SECRET_KEY } = process.env;

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(CustomError.NotFoundError('Не верный ID пользователя'));
    }
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });

    return res.status(HTTPStatus.CREATED).json({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (err: any) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(CustomError.Conflict('Эта почта уже используется'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};

export const updateUser = async (req: IAuthReq, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
    } = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id, {
      name,
      about,
      avatar,
    }, {
      new: true,
      runValidators: true,
    });

    return res.send(user);
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      return next(CustomError.NotFoundError('Не верный ID пользователя'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};

export const updateUserAvatar = async (req: IAuthReq, res: Response, next: NextFunction) => {
  try {
    const {
      avatar,
    } = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id, {
      avatar,
    });

    return res.send(user);
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      return next(CustomError.NotFoundError('Не верный ID пользователя'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY as string, { expiresIn: '7d' });
    return res.cookie('JWT', token, {
      httpOnly: true,
      sameSite: true,
    }).send({
      _id: user._id,
    });
  } catch (err) {
    return next(err);
  }
};
