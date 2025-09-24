import { z } from "zod/v4";

const drawerSchema = z.object({
  id: z.number(),
  drawerTypeId: z.number(),
  parentId: z.number(),
  name: z.string(),
  description: z.string(),
  created: z.date(),
  lastModified: z.date(),
  effectivePermissions: z.number(),
});

export type ImagerightDrawer = z.infer<typeof drawerSchema>;

