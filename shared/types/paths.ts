export interface Resource { id: string; title: string; url: string; type: string; }
export interface Stage { id: string; title: string; position: number; resources: Resource[]; }
export interface SubPath { id: string; title: string; slug: string; stages: Stage[]; }
export interface Path { id: string; title: string; slug: string; description: string; subPaths: SubPath[]; }

