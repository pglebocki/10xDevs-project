import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import repositoriesRoutes from './routes/repositories-routes.js';
import healthRoutes from './routes/health-routes.js';
import { HealthController } from './controllers/health-controller.js';
import { RepositoriesController } from './controllers/repositories-controller.js';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/repositories', repositoriesRoutes);
app.use('/health', healthRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 