import { Router } from 'express';
import {
  getUsers, getUser, updateUser, updateUserAvatar,
} from '../controllers/users';
import { getUserValidation, updateAvatarValidation, updateUserValidation } from '../validation/userValidation';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserValidation, getUser);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

export default userRouter;
