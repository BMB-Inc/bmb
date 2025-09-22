import { z } from "zod/v4";

const attributeSchema = z.object({
  DisplayName: z.string(),
  Name: z.string(),
});

export const createDocumentSchema = z.object({
  ParentId: z.number(),
  DocumentTypeId: z.number(),
  Description: z.string(),
  DocumentDate: z.string().date(),
  ReceivedDate: z.string().datetime(),
  Attributes: z.array(attributeSchema),
});

export type CreateDocument = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = createDocumentSchema.partial();

export type UpdateDocument = z.infer<typeof updateDocumentSchema>;

export const deleteDocumentSchema = updateDocumentSchema;

export type DeleteDocument = z.infer<typeof deleteDocumentSchema>;

export const documentSearchSchema = updateDocumentSchema;

export type DocumentSearch = z.infer<typeof documentSearchSchema>;

export const moveDocumentSchema = z.object({
  DocumentIds: z.array(z.number()),
  TargetParentId: z.number(),
  TargetTypeConversionId: z.number(),
  TypeIdPath: z.array(z.number()),
});

export type MoveDocument = z.infer<typeof moveDocumentSchema>;

export const copyDocumentSchema = moveDocumentSchema;

export type CopyDocument = z.infer<typeof copyDocumentSchema>;

export const updateDocumentPropertiesSchema = z.object({
  Description: z.string(),
  DocumentDate: z.string().date(),
  ReceivedDate: z.string().datetime(),
  DocTypeId: z.number(),
  NewAttributes: z.array(attributeSchema),
  AttributesToChange: z.array(attributeSchema),
  AttributesToRemove: z.array(z.number()),
});

export type UpdateDocumentProperties = z.infer<typeof updateDocumentPropertiesSchema>;