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

export const createAppSchema = z.object({
  type: z
    .enum(BMBAppTypes)
    .optional()
    .refine((value) => value !== undefined, {
      message: "Type is required",
    }),
  title: z.string().min(1, "Title is required"),
  url: z.string().min(1, "URL is required"),
  image: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  docs_page: z.string().min(1, "Docs page URL is required").optional().or(z.literal("")),
});

export const updateAppSchema = createAppSchema.partial();

export type BMBAppSchema = z.infer<typeof bmbAppSchema>;

export type CreateAppSchema = z.infer<typeof createAppSchema>;
export type UpdateAppSchema = z.infer<typeof updateAppSchema>;


