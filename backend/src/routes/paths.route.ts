import { Router } from 'express';
import { listPaths, getPath, getSpecializations, getSpecialization } from '../controllers/paths.controller';

const router = Router();

router.get('/', listPaths);
router.get('/:slug', getPath);
router.get('/:pathSlug/specializations', getSpecializations);
router.get('/:pathSlug/specializations/:specSlug', getSpecialization);

export default router;