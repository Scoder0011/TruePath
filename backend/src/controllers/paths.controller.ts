import { Request, Response } from 'express';
import { getAllPaths, getPathBySlug, getPathWithFullTree } from '../models/path.model';
import { getSpecializationsByPath, getSpecializationWithFullTree } from '../models/specialization.model';

export async function listPaths(req: Request, res: Response) {
  try {
    const paths = await getAllPaths();
    res.json(paths);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPath(req: Request, res: Response) {
  try {
    const path = await getPathWithFullTree(req.params.slug);
    res.json(path);
  } catch (err: any) {
    res.status(404).json({ error: 'Path not found' });
  }
}

export async function getSpecializations(req: Request, res: Response) {
  try {
    const specs = await getSpecializationsByPath(req.params.pathSlug);
    res.json(specs);
  } catch (err: any) {
    res.status(404).json({ error: 'Path not found' });
  }
}

export async function getSpecialization(req: Request, res: Response) {
  try {
    const spec = await getSpecializationWithFullTree(
      req.params.pathSlug,
      req.params.specSlug
    );
    res.json(spec);
  } catch (err: any) {
    res.status(404).json({ error: 'Specialization not found' });
  }
}