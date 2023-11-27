import { Joi, celebrate, Segments } from 'celebrate';
import { urlRegexp } from '../utils/constants';

export const getUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().length(24).hex().required(),
  }),
});

export const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

export const updateAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().pattern(urlRegexp).required(),
  }),
});

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegexp),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  }),
});

export const loginUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  }),
});
