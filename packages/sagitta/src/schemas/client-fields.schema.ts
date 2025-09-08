import { z } from 'zod';

export const ClientFieldSchema = z.enum(['clientName', 'clientCode']);

export type ClientField = z.infer<typeof ClientFieldSchema>;

export const clientFieldOptions = [
  { value: 'clientName', label: 'Client Name' },
  { value: 'clientCode', label: 'Client Code' },
] as const;
