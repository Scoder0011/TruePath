export interface Resource {
  id: string;
  title: string;
  url: string;
  type?: string;
}

export interface Stage {
  id: string;
  title: string;
  resources: Resource[];
}

export interface SubPath {
  id: string;
  slug: string;
  title: string;
  description?: string;
  stages: Stage[];
}

export interface Path {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sub_paths: SubPath[];
}

