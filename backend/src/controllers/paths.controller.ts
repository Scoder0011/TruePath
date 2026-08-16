// Path request handlers belong here as data access is implemented.
import { Request, Response } from 'express';
import { getAllPaths, getPathWithFullTree } from '../models/path.model';

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
