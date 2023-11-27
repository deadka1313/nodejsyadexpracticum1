import { Router } from 'express';
import {
  getCards, createCard, removeCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { createCardValidation, getCardValidation } from '../validation/cardValidation';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:cardId', getCardValidation, removeCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;
