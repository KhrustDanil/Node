import express from 'express';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import { createAdmin } from './createAdmid';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';
import connectDB from './repository/mongoRepository';
import swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API documentation for user-related operations',
    },
  },
  apis: ['./src/routes/**/*.ts']
};

const swaggerSpec: any = swaggerJSDoc(swaggerOptions);

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3000;

connectDB()

createAdmin();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});

export default app;