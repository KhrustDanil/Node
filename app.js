import express from 'express';
import routes from './routes/routes.js';
import { checkUserId } from './middleware/checkUserId.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(checkUserId);

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});