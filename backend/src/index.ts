import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import repositoriesRoutes from './routes/repositories-routes';

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 