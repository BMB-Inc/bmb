import { z } from 'zod';
import { ExpenseDivisionGLCodes } from '@bmb-inc/types';

// Create division field names from the enum keys
const divisionFields = Object.keys(ExpenseDivisionGLCodes).filter(key => isNaN(Number(key))) as Array<keyof typeof ExpenseDivisionGLCodes>;

export const SearchFieldSchema = z.enum(['staffCode', 'staffName', 'email', ...divisionFields]);

export type SearchField = z.infer<typeof SearchFieldSchema>;

export const searchFieldOptions = [
  { value: 'staffName', label: 'Staff Name' },
  { value: 'staffCode', label: 'Staff Code' },
  { value: 'email', label: 'Email' },
  // Add each division as a separate search field option
  ...divisionFields.map(division => ({
    value: division,
    label: division,
  })),
] as const;
