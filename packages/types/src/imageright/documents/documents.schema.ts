import { z } from "zod/v4";
import { imagerightFileSchema } from "../file.schema";
import { imagerightAttributeSchema } from "../attribute.schema";
import { imagerightFolderSchema } from "../folders";

// Main document schema
export const imagerightDocumentSchema = z.object({
  id: z.number(),
  description: z.string(),
  effectivePermissions: z.number(),
  pageCount: z.number(),
  dateCreated: z.date(),
  dateLastModified: z.date(),
  documentDate: z.date(),
  receivedDate: z.date(),
  deleted: z.boolean(),
  documentTypeId: z.number(),
  documentTypeDescription: z.string(),
  attributes: z.array(imagerightAttributeSchema),
  cutOffDate: z.date(),
  retentionDate: z.date(),
  documentName: z.string(),
  file: imagerightFileSchema,
  folder: z.array(imagerightFolderSchema),
});

// Schema for array of documents
export const imagerightDocumentsSchema = z.array(imagerightDocumentSchema);

// Export types
export type ImagerightDocumentFile = z.infer<typeof imagerightFileSchema>;
export type ImagerightDocument = z.infer<typeof imagerightDocumentSchema>;
export type ImagerightDocuments = z.infer<typeof imagerightDocumentsSchema>;

export const imagerightDocumentParamsSchema = z.object({
  clientId: z.number().optional(),
  folderId: z.number().optional(),
});

export type ImagerightDocumentParams = z.infer<typeof imagerightDocumentParamsSchema>;
