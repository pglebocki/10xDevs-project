import express from 'express';
import { HealthController } from '../controllers/health-controller.js';

const router = express.Router();
const healthController = new HealthController();
router.get('/', healthController.getHealth);

export default router; 