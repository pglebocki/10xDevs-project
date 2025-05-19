import { Router } from 'express';
import { RepositoriesController } from '../controllers/repositories-controller.js';

const router = Router();
const repositoriesController = new RepositoriesController();
router.get('/', repositoriesController.getRepositories);

export default router; 