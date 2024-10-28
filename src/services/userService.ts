import { UserRepository } from '../repository/userRepository';
import { BadRequest } from '../error/errors';
import bcrypt from 'bcrypt';
import { IUser, IUserData } from '../models/User'; // Імпорт вашої моделі `IUser`

export class UserService {
  private userRepository = new UserRepository();

  async registerUser(email: string, password: string, name: string, role: IUser['role'] = 'CUSTOMER'): Promise<IUser> {
    if (!email || !password || !name) {
      throw new BadRequest('All fields are required');
    }

    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequest('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser: IUserData = {
      email,
      name,
      passwordHash: hashedPassword,
      role,
    };

    return this.userRepository.saveUser(newUser);
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new BadRequest('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.getUserByEmail(email);
  }
}