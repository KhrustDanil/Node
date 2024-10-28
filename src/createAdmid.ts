import { User, UserRole } from './models/User';
import { hashPassword } from './utils/bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const createAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASSWORD) {
    console.error('Admin credentials are missing in the .env file');
    return;
  }

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  const adminUser = new User({
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    passwordHash,
    role: UserRole.ADMIN,
  });

  await adminUser.save();
  console.log('Admin user created successfully');
};
