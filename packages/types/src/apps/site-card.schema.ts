import { z } from "zod/v4";

export enum BMBAppTypes {
  APP = "app",
  REPORT = "report",
}

export const bmbAppSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  type: z.enum(BMBAppTypes),
  url: z.string(),
  image: z.string(),
  description: z.string(),
  docs_page: z.string().optional(),
  updated_at: z.coerce.date(),
  created_at: z.coerce.date(),
});

export const createBMBAppSchema = bmbAppSchema.omit({
  id: true,
  updated_at: true,
  created_at: true,
});

export const updateBMBAppSchema = bmbAppSchema.partial();

export type BMBAppSchema = z.infer<typeof bmbAppSchema>;

export type CreateBMBAppSchema = z.infer<typeof createBMBAppSchema>;
export type UpdateBMBAppSchema = z.infer<typeof updateBMBAppSchema>;


