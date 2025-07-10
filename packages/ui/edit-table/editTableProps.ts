import { FetchResult } from '@apollo/client';
import React, { ReactElement } from 'react';
import { approveType } from './EditTable';
import { MRT_ColumnDef, MRT_TableOptions } from 'mantine-react-table';
import { BaseTableSchema } from '@schemas/util';
import { FileCategory } from '@schemas/s3';

export type ValidationResult<T> = {
  errors: Record<string, string | undefined>;
  parsedData: T;
};

export interface EditTableProps<DataInterface extends BaseTableSchema> {
  title: string;
  addTitle?: string;
  data: DataInterface[] | undefined;
  columns: MRT_ColumnDef<DataInterface>[];
  deleteRow?: (id: string) => Promise<FetchResult<unknown>>;
  addRowComponent?: () => ReactElement;
  editVariant?: 'modal' | 'row' | 'cell' | 'table' | 'custom';
  sortBy?: { id: string; desc: boolean };
  deletable?: boolean;
  showRequired?: boolean;
  readOnly?: boolean;
  download?: boolean;
  loading?: boolean;
  update?: (id: string, values: Partial<DataInterface>) => Promise<FetchResult<unknown>>;
  add?: (values: DataInterface) => Promise<FetchResult<unknown>>;
  idField?: keyof DataInterface;
  validationRules?: (values: DataInterface) => { update: ValidationResult<DataInterface>; create: ValidationResult<DataInterface> };
  approve?: approveType;
  initialValues?: DataInterface;
  controls?: boolean;
  props?: Partial<MRT_TableOptions<DataInterface>>;
  statCards?: React.ReactNode;  
  upload?: {
    policyApplicationId?: string;
    category: FileCategory; 
  }
  showApproveButton?: boolean;
  withBorder?: boolean;
}
