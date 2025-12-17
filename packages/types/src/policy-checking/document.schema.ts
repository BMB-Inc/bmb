import z from 'zod/v4';

export const policyCheckDocumentSchema = z.object({
  id: z.uuid(),
  request_id: z.uuid(),
  imageright_document_id: z.number().int().nullable(),
  minio_bucket: z.string(),
  minio_object_key: z.string(),
  minio_version_id: z.string().nullable(),
  filename: z.string(),
  content_type: z.string(),
  size: z.number().int(),
  created_at: z.coerce.date(),
});

export const importedDocumentSchema = z.object({
  id: z.string(),
  imageright_document_id: z.number().int().nullable(),
  minio_bucket: z.string(),
  minio_object_key: z.string(),
  minio_version_id: z.string().nullable(),
  filename: z.string(),
  content_type: z.string(),
  size: z.number().int(),
});

export type PolicyCheckDocument = z.infer<typeof policyCheckDocumentSchema>;
export type ImportedDocument = z.infer<typeof importedDocumentSchema>;
