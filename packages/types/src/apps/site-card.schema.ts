import { z } from "zod/v4";
import { Icon } from "@tabler/icons-react";

export enum SiteCardType {
  APP = "app",
  REPORT = "report",
}

export const SiteCardSchema = z.object({
  title: z.string(),
  type: z.enum(SiteCardType),
  url: z.string(),
  icon: z.custom<Icon>,
  image: z.string(),
  description: z.string(),
  docsPage: z.string().optional(),
});

export type SiteCard = z.infer<typeof SiteCardSchema>;


