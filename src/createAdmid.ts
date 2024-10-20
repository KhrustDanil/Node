import { randomUUID } from 'crypto';
import { User, users } from './storage/storage';
import { hashPassword } from './utils/bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const createAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASSWORD) {
    console.error('Admin credentials are missing in the .env file');
    return;
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  const adminUser: User = {
    id: randomUUID(),
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    passwordHash,
    role: 'ADMIN',
  };

  users.push(adminUser);
  console.log('Admin user created successfully');
};