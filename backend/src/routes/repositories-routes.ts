import { Router } from 'express';
import { RepositoriesController } from '../controllers/repositories-controller.js';

const router = Router();
const repositoriesController = new RepositoriesController();
router.get('/', repositoriesController.getRepositories);
router.get('/:repoId/developers', repositoriesController.getDevelopersFromRepository);
router.get('/:repoId/developers/:developerId/pull-requests', repositoriesController.getDeveloperPullRequests);

export default router; 