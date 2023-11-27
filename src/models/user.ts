import validator from 'validator';
import {
  Model, model, Schema, Document,
} from 'mongoose';
import bcrypt from 'bcrypt';
import CustomError from '../errors/CustomError';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw CustomError.Unauthorized('Неверно введен логин или пароль');
  }
  const userValid = await bcrypt.compare(password, user.password);
  if (!userValid) {
    throw CustomError.Unauthorized('Неверно введен логин или пароль');
  }
  return user;
});

export default model<IUser, IUserModel>('user', userSchema);
