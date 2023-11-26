import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import CustomError from '../errors/CustomError';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      link,
    } = req.body;

    const card = await Card.create({
      name,
      link,
      // @ts-ignore
      owner: req.user._id,
    });

    return res.send(card);
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};

export const removeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);

    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(CustomError.NotFoundError('Не верный ID кароточки'));
    }
    return next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      // @ts-ignore
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(CustomError.NotFoundError('Не верный ID кароточки'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      // @ts-ignore
      { pull: { likes: req.user._id } },
      { new: true },
    );

    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(CustomError.NotFoundError('Не верный ID кароточки'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};
