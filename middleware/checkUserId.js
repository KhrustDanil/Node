import { users } from '../storage.js';

export const checkUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized, x-user-id is missing' });
  }

  const userExists = users.find(user => user.id === userId);

  if (!userExists) {
    return res.status(404).json({ error: 'User not found' });
  }

  req.userId = userId;
  next();
};