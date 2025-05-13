import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('10xDevs Backend API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 