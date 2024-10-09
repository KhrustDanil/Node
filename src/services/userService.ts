import { UserRepository } from '../repository/userRepository';
import { BadRequest } from '../error/errors';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export class UserService {
  private userRepository = new UserRepository();

  registerUser(email: string, password: string, name: string) {
    if (!email || !password || !name) {
      throw new BadRequest('All fields are required');
    }

    const existingUser = this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequest('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: randomUUID(),
      email,
      name,
      password: hashedPassword,
    };

    this.userRepository.saveUser(newUser);
    return newUser;
  }

  getUserById(userId: string) {
    const user = this.userRepository.getUserById(userId);
    if (!user) {
      throw new BadRequest('User not found');
    }
    return user;
  }
}
