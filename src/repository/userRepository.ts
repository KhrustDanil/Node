import { User, users } from '../storage/storage';

export class UserRepository {
  getUserByEmail(email: string): User | undefined {
    return users.find(user => user.email === email);
  }

  getUserById(userId: string): User | undefined {
    return users.find(user => user.id === userId);
  }

  saveUser(user: User): void {
    users.push(user);
  }
}
