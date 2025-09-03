import { z } from 'zod';

export const SearchFieldSchema = z.enum(['staffCode', 'staffName', 'email']);

export type SearchField = z.infer<typeof SearchFieldSchema>;

export const searchFieldOptions = [
  { value: 'staffName', label: 'Staff Name' },
  { value: 'staffCode', label: 'Staff Code' },
  { value: 'email', label: 'Email' },
] as const;
