import { z } from 'zod';

const compressionLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const compressPdfQueryDto = z.object({
  compressionLevel: compressionLevelSchema.optional(),
});

export type CompressPdfQueryDto = z.infer<typeof compressPdfQueryDto>;
export type CompressionLevelValue = z.infer<typeof compressionLevelSchema>;
