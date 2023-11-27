import { Joi, celebrate, Segments } from 'celebrate';
import { urlRegexp } from '../utils/constants';

export const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlRegexp).required(),
    owner: Joi.string().length(24).hex().required,
    createdAt: Joi.date(),
  }),
});

export const getCardValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().length(24).hex().required,
  }),
});
