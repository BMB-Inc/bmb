import { Tooltip, ActionIcon, Flex, Divider, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconAlertCircle, IconPencil, IconEye, IconTrash, IconRestore } from '@tabler/icons-react';
import { MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { EditTableProps } from './editTableProps';
import { BaseTableSchema } from '@schemas/util';

export function EditTableActions<T extends BaseTableSchema>({
  row,
  table,
  update,
  deleteRow,
  setSelectedHistoryRow,
  open,
  deletable,
}: {
  row: MRT_Row<T>;
  table: MRT_TableInstance<T>;
  update: EditTableProps<T>['update'];
  deleteRow: EditTableProps<T>['deleteRow'];
  setSelectedHistoryRow: (row: T) => void;
  open: () => void;
  deletable: EditTableProps<T>['deletable'];
}) {
  return (
    <>
      <Tooltip label="Edit" position="top">
        <ActionIcon
          aria-label="Edit Row"
          variant="subtle"
          color="blue"
          size="lg"
          onClick={() => {
            if (row?.original.DELETED) {
              const openModal = () =>
                modals.openConfirmModal({
                  title: (
                    <Flex align="center" gap="sm">
                      <IconAlertCircle size={24} color="red" />
                      <Text fw={600} size="sm">
                        Unable to edit this row
                      </Text>
                    </Flex>
                  ),
                  children: (
                    <>
                      <Divider w="100%" mb={'md'} />
                      <Flex>
                        <Text size="sm" c="dimmed">
                          If you wish to edit this row, it must first be undeleted. Click the button below to undelete this row.
                        </Text>
                      </Flex>
                    </>
                  ),
                  labels: { confirm: 'Undelete Row', cancel: 'Cancel' },
                  onConfirm: () => update && update(row.original.APPLICATION_ID, { DELETED: false } as Partial<T>),
                });
              openModal();
            } else {
              table.setEditingRow(row);
            }
          }}
        >
          <IconPencil />
        </ActionIcon>
      </Tooltip>
      {row.original.UPDATED_DATE && (
      <Tooltip label="View Changes" position="top">
        <ActionIcon
          aria-label="View Changes"
          variant="subtle"
          color="gray"
          size="lg"
          onClick={() => {
            if (row.original.APPLICATION_ID) {
              open();
              setSelectedHistoryRow(row.original);
            }
          }}
        >
          <IconEye />
        </ActionIcon>
      </Tooltip>
      )}
      {deletable && !row?.original?.DELETED ? (
        <Tooltip label="Delete Row" position="top">
          <ActionIcon
            aria-label="Delete Row"
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => {
              if (row.original.APPLICATION_ID) {
                deleteRow && deleteRow(row.original.APPLICATION_ID);
              }
            }}
          >
            <IconTrash color="red" />
          </ActionIcon>
        </Tooltip>
      ) : deletable ? (
        <Tooltip label="Undelete Row" position="top">
          <ActionIcon
            aria-label="Undelete Row"
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => {
              if (row.original.APPLICATION_ID) {
                update && update(row.original.APPLICATION_ID, { DELETED: false } as Partial<T>);
              }
            }}
          >
            <IconRestore color="#228be6" />
          </ActionIcon>
        </Tooltip>
      ) : null}
    </>
  );
}
