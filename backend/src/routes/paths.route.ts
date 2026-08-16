import { Router } from 'express';
import { listPaths, getPath } from '../controllers/paths.controller';

const router = Router();

router.get('/', listPaths);
router.get('/:slug', getPath);

export default router;