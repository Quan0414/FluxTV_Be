import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import channelRoutes from './routes/channelRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { startStreamCheckJob } from './services/streamChecker.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Swagger
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}


// Rate Limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api/channels', channelRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Kiểm tra trạng thái Server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server hoạt động bình thường
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Start the background job to check streams periodically (every 5 minutes)
  startStreamCheckJob(5 * 60 * 1000);
});
