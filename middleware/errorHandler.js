export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.status || 500;

  let message = 'Internal server error';
  
  if (statusCode === 400) message = 'Bad Request';
  else if (statusCode === 401) message = 'Unauthorized';
  else if (statusCode === 403) message = 'Forbidden';
  else if (statusCode === 404) message = 'Not Found';
  else if (statusCode === 422) message = 'Unprocessable Entity';

  res.status(statusCode).json({ error: message });
};