export const checkUserId = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized, x-user-id is missing' });
    }
    req.userId = userId;
    next();
  };