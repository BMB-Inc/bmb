import { MRT_Cell, MRT_RowData } from 'mantine-react-table';

export function getRowColors<T extends MRT_RowData>(cell: MRT_Cell<T, unknown>) {
  const isSelected = cell?.row?.getIsSelected();
  const isUpdated = cell?.row?.original?.UPDATED_DATE;
  const isDeleted = cell?.row?.original?.DELETED;

  if (isSelected) {
    return {
      className: 'selected-row',
      style: {
        backgroundColor: '#d1ffd5',
      },
    };
  }
  if (isDeleted) {
    return {
      className: 'deleted-row',
    };
  }
  if (isUpdated) {
    return {
      className: 'updated-row',
      style: {
        backgroundColor: '#d1ffd5',
      },
    };
  } else {
    return {};
  }
}
