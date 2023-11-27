import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import HTTPStatus from 'http-status';
import Card from '../models/card';
import CustomError from '../errors/CustomError';
import { IAuthReq } from '../utils/types';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: IAuthReq, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      link,
    } = req.body;

    const card = await Card.create({
      name,
      link,
      owner: req.user?._id,
    });

    return res.send(card);
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Ошибка валидации'));
    }
    return next(err);
  }
};

export const removeCard = async (req: IAuthReq, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail();
    if (card.owner.toString() !== req.user?._id.toString()) {
      throw CustomError.Unauthorized('Вы не можете удалить карточку другого пользователя');
    }

    const deleteCard = await card.deleteOne();

    return res.status(HTTPStatus.NO_CONTENT).send({ data: deleteCard });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(CustomError.NotFoundError('Не верный ID кароточки'));
    }
    return next(err);
  }
};

export const likeCard = async (req: IAuthReq, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
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

export const dislikeCard = async (req: IAuthReq, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { pull: { likes: req.user?._id } },
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
