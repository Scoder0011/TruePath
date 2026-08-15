import { z } from "zod";
export const resourceSchema = z.object({ id: z.string(), title: z.string(), url: z.string().url(), type: z.string() });
export const stageSchema = z.object({ id: z.string(), title: z.string(), position: z.number().int(), resources: z.array(resourceSchema) });
export const subPathSchema = z.object({ id: z.string(), title: z.string(), slug: z.string(), stages: z.array(stageSchema) });
export const pathSchema = z.object({ id: z.string(), title: z.string(), slug: z.string(), description: z.string(), subPaths: z.array(subPathSchema) });

