import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import CustomError from '../errors/CustomError';

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
    } = req.body;

    const user = await User.create({
      name,
      about,
      avatar,
    });

    return res.send(user);
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
    } = req.body;

    // @ts-ignore
    const user = await User.findByIdAndUpdate(req.user._id, {
      name,
      about,
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

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      avatar,
    } = req.body;

    // @ts-ignore
    const user = await User.findByIdAndUpdate(req.user._id, {
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
