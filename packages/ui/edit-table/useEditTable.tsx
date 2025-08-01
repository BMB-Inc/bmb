import { MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { validationErrorsAtom } from '@atoms/Atoms';
import { RefObject } from 'react';
import { EditTableProps } from './editTableProps';
import { BaseTableSchema } from '@schemas/util';

interface UseEditTableProps<DataInterface extends BaseTableSchema> {
  update?: EditTableProps<DataInterface>['update'];
  add?: EditTableProps<DataInterface>['add'];
  validationRules?: EditTableProps<DataInterface>['validationRules'];
  tableContainerRef: RefObject<HTMLDivElement>;
}

export function useEditTable<DataInterface extends BaseTableSchema>({ update, add, validationRules, tableContainerRef }: UseEditTableProps<DataInterface>) {
  const [, setValidationErrors] = useAtom(validationErrorsAtom);

  const handleSaveRow = useCallback(
    async ({ row, values, table }: { row: MRT_Row<DataInterface>; values: DataInterface; table: MRT_TableInstance<DataInterface> }) => {
      if (!update || !validationRules) return;
      const id = row.original['APPLICATION_ID'];
      const cleanedValues = Object.fromEntries(
        Object.entries(values).filter(([key]) => !key.endsWith('_OLD'))
      );
      const { parsedData, errors } = validationRules(cleanedValues as DataInterface).update;
      if (Object?.values(errors)?.some((error) => error)) {
        setValidationErrors(errors);
        return;
      } else {
        setValidationErrors({});
        await update(id, parsedData);
        table.setEditingRow(null);
        table.setSorting([{ id: 'UPDATED_DATE', desc: true }]);
        table.setShowGlobalFilter(false);
        table.setShowGlobalFilter(true);
      }
    },
    [setValidationErrors, update, validationRules]
  );

  const handleCreateRow = useCallback(
    async (values: DataInterface, exitCreatingMode: () => void) => {
      if (!add || !validationRules) return;
      const { parsedData, errors } = validationRules(values).create;
      if (Object?.values(errors)?.some((error) => error)) {
        setValidationErrors(errors);
        return;
      } else {
        setValidationErrors({});
        await add(parsedData);
        exitCreatingMode();
      }
    },
    [add, setValidationErrors, validationRules]
  );

  const scrollHorizontally = useCallback(
    (direction: 'left' | 'right') => {
      if (tableContainerRef.current) {
        const scrollAmount = direction === 'left' ? -600 : 600;
        tableContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    },
    [tableContainerRef]
  );

  return {
    handleSaveRow,
    handleCreateRow,
    scrollHorizontally,
  };
}
