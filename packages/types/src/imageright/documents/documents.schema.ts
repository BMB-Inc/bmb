import { z } from "zod/v4";

const attributeSchema = z.object({
  DisplayName: z.string(),
  Name: z.string(),
});

export const createImagerightDocumentSchema = z.object({
  ParentId: z.number(),
  DocumentTypeId: z.number(),
  Description: z.string(),
  DocumentDate: z.string().date(),
  ReceivedDate: z.string().datetime(),
  Attributes: z.array(attributeSchema),
});

export type CreateImagerightDocument = z.infer<
  typeof createImagerightDocumentSchema
>;

export const updateImagerightDocumentSchema =
  createImagerightDocumentSchema.partial();

export type UpdateImagerightDocument = z.infer<
  typeof updateImagerightDocumentSchema
>;

export const deleteImagerightDocumentSchema = updateImagerightDocumentSchema;

export type DeleteImagerightDocument = z.infer<
  typeof deleteImagerightDocumentSchema
>;

export const imagerightDocumentSearchSchema = updateImagerightDocumentSchema;

export type ImagerightDocumentSearch = z.infer<
  typeof imagerightDocumentSearchSchema
>;

export const moveImagerightDocumentSchema = z.object({
  DocumentIds: z.array(z.number()),
  TargetParentId: z.number(),
  TargetTypeConversionId: z.number(),
  TypeIdPath: z.array(z.number()),
});

export type MoveImagerightDocument = z.infer<
  typeof moveImagerightDocumentSchema
>;

export const copyImagerightDocumentSchema = moveImagerightDocumentSchema;

export type CopyImagerightDocument = z.infer<
  typeof copyImagerightDocumentSchema
>;

export const updateImagerightDocumentPropertiesSchema = z.object({
  Description: z.string(),
  DocumentDate: z.string().date(),
  ReceivedDate: z.string().datetime(),
  DocTypeId: z.number(),
  NewAttributes: z.array(attributeSchema),
  AttributesToChange: z.array(attributeSchema),
  AttributesToRemove: z.array(z.number()),
});

export type UpdateDocumentProperties = z.infer<
  typeof updateImagerightDocumentPropertiesSchema
>;

