import { ActionIcon, Button, Card, Group, Title, Modal } from '@mantine/core';
import { MantineReactTable, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton } from 'mantine-react-table';
import { memo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { validationErrorsAtom } from '@atoms/Atoms';
import { ApproveButton } from '@components/utilities/ApproveButton';
import { DownloadXLSX } from '@components/utilities/DownloadXLSX';
import { useDisclosure } from '@mantine/hooks';
import { EditTableActions } from './EditTableActions';
import { EditTableProps } from './editTableProps';
import { getRowColors } from './editTableUtils';
import { useEditTable } from './useEditTable';
import { BaseTableSchema } from '@schemas/util';
import { LockedOverlay } from '../LockedOverlay';
import { FetchResult } from '@apollo/client';
import { RowHistoryTable } from '../HistoryTable';

export type approveType = {
  approveFn: () => Promise<FetchResult<{ success: boolean }>>;
  approved: boolean;
};

/**
 * A reusable table component that supports editing, deleting, and viewing history of rows
 * @template T - Type extending MRT_RowData and MantineRowInterface<T> to ensure proper row data structure
 * @param props - EditTableProps<T> containing configuration options for the table
 * @returns A Mantine React Table component with editing capabilities
 */
export const EditTable = memo(
  <DataInterface extends BaseTableSchema>({
    title,
    addTitle,
    data,
    columns,
    loading,
    update,
    deleteRow,
    add,
    idField,
    validationRules,
    approve,
    deletable = false,
    readOnly,
    editVariant,
    props,
    sortBy,
    download,
    statCards,
    withBorder = false,
    showApproveButton = true,
  }: EditTableProps<DataInterface>) => {
    const [, setValidationErrors] = useAtom(validationErrorsAtom);
    const [selectedHistoryRow, setSelectedHistoryRow] = useState<DataInterface | null>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableRowElement>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { handleSaveRow, handleCreateRow } = useEditTable<DataInterface>({
      update,
      add,
      validationRules,
      tableContainerRef,
    });

    return (
      <Card shadow="none" withBorder={withBorder}>
        <LockedOverlay isLocked={approve?.approved ?? false} message={`${title} APPROVED`} />
        {statCards && statCards}
        <Group justify="space-between" align="center">
          <Title order={3}>{title}</Title>
          <Group>{data && approve && !approve?.approved && showApproveButton && <ApproveButton approve={approve} />}</Group>
        </Group>
        <MantineReactTable<DataInterface>
          mantineTableContainerProps={{
            style: {
              maxHeight: 'calc(100vh - 210px)',
            },
            ref: tableContainerRef,
          }}
          mantineTableBodyRowProps={{
            ref: tableRef,
          }}
          data={data ?? []}
          columns={columns ?? []}
          state={{
            isLoading: loading,
            showSkeletons: loading,
            pagination: pagination,
          }}
          onPaginationChange={setPagination}
          paginationDisplayMode="pages"
          enablePagination={data && data.length > pagination.pageSize}
          mantinePaperProps={{
            withBorder: false,
            shadow: 'none',
          }}
          initialState={{
            showGlobalFilter: true,
            density: 'xs',
            sorting: sortBy ? [sortBy] : data?.[0]?.UPDATED_DATE ? [{ id: 'UPDATED_DATE', desc: false }] : [],
            columnPinning: {
              left: ['mrt-row-actions', 'VEHICLEIDENTIFICATIONNO'],
            },
          }}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              header: 'Edit',
              size: 80,
            },
          }}
          positionToolbarAlertBanner={'none'}
          enableSelectAll={false}
          enableEditing={!approve?.approved && !readOnly}
          editDisplayMode={editVariant ?? 'modal'}
          onEditingRowSave={({ row, values, table }) => handleSaveRow({ row, values: values as DataInterface, table })}
          onEditingRowCancel={() => setValidationErrors({})}
          getRowId={(row: DataInterface) => {
            const id = idField ? row?.[idField] : row?.APPLICATION_ID;
            return String(id);
          }}
          onCreatingRowSave={({ values, exitCreatingMode }) => handleCreateRow(values as DataInterface, exitCreatingMode)}
          onCreatingRowCancel={() => setValidationErrors({})}
          enableHiding={false}
          enableStickyHeader={true}
          mantineTableProps={{
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
            striped: true,
            style: {
              border: '0',
              boxShadow: 'none',
            },
          }}
          layoutMode="semantic"
          mantineTableBodyCellProps={({ cell }) => {
            const color = getRowColors(cell);
            return { ...color, style: { border: 0 } };
          }}
          renderRowActions={({ row, table }) => {
            return (
              <ActionIcon.Group>
                <EditTableActions row={row} table={table} update={update} deleteRow={deleteRow} setSelectedHistoryRow={setSelectedHistoryRow} open={open} deletable={deletable} />
              </ActionIcon.Group>
            );
          }}
          renderToolbarInternalActions={({ table }) => (
            <Group gap="sm" p="sm">
              {download && data && <DownloadXLSX data={data} title={title} />}
              <MRT_ToggleFiltersButton size={'sm'} table={table} />
              <MRT_ToggleDensePaddingButton size={'sm'} table={table} />
              <MRT_ToggleFullScreenButton size={'sm'} table={table} />
            </Group>
          )}
          renderBottomToolbarCustomActions={({ table }) =>
            add && (
              <Button onClick={() => table.setCreatingRow(true)} disabled={approve?.approved}>
                {(addTitle && `Add ${addTitle}`) ?? 'Add Row'}
              </Button>
            )
          }
          mantineBottomToolbarProps={{
            style: {
              border: '0',
              boxShadow: 'none',
            },
          }}
          {...props}
        />
        <Modal opened={opened} onClose={close} size="auto" padding="md">
          {selectedHistoryRow && <RowHistoryTable row={selectedHistoryRow} />}
        </Modal>
      </Card>
    );
  }
);

const EditTableWithGeneric = EditTable as <T extends BaseTableSchema>(props: EditTableProps<T>) => JSX.Element;
export default EditTableWithGeneric;
