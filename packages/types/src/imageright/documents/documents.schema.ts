import { z } from "zod/v4";
import { imagerightAttributeSchema } from "../attribute.schema";
import { imagerightFolderSchema } from "../folders";
import { imagerightClientSchema } from "../clients";

// Main document schema
export const imagerightDocumentSchema = z.object({
  id: z.number(),
  description: z.string(),
  effectivePermissions: z.number(),
  pageCount: z.number(),
  dateCreated: z.string(),
  dateLastModified: z.string(),
  documentDate: z.string(),
  receivedDate: z.string(),
  deleted: z.boolean(),
  documentTypeId: z.number(),
  documentTypeDescription: z.string(),
  attributes: z.array(imagerightAttributeSchema),
  cutOffDate: z.string(),
  retentionDate: z.string(),
  documentName: z.string(),
  file: imagerightClientSchema,
  folder: z.array(imagerightFolderSchema),
});

export const imagerightDocumentsSchema = z.array(imagerightDocumentSchema);

export type ImagerightDocument = z.infer<typeof imagerightDocumentSchema>;
export type ImagerightDocuments = z.infer<typeof imagerightDocumentsSchema>;

export const imagerightDocumentParamsSchema = z.object({
  clientId: z.number().optional(),
  folderId: z.number().optional(),
});

export type ImagerightDocumentParams = z.infer<
  typeof imagerightDocumentParamsSchema
>;
