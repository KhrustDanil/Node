
import { User, IUser, IUserData } from '../models/User';

export class UserRepository {
  // Отримати користувача за email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  // Отримати користувача за ID
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).exec();
  }

  // Зберегти нового користувача
  async saveUser(userData: IUserData): Promise<IUser> {
    const newUser = new User(userData);
    return newUser.save();
  }
}