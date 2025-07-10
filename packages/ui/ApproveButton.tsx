import { Button, Group, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { approveType } from '@components/utilities/edit-table/EditTable';

interface ApproveButtonProps {
  approve: approveType;
  disabled?: boolean;
}

export function ApproveButton({ approve: { approveFn, approved }, disabled }: ApproveButtonProps) {
  const openModal = () => {
    // modals.closeAll();
    modals.openConfirmModal({
      title: 'Please confirm',
      children: (
        <Text size="sm">
          Approving this page will lock it, preventing any further changes. This information will be used to renew this policy, and any additional changes hereafter will require
          the assistance of your account manager. Are you sure you want to approve?
        </Text>
      ),
      labels: { confirm: 'Confirm Approval', cancel: 'Cancel' },
      onCancel: () => console.log('canceled'),
      onConfirm: () => approveFn(),
    });
  };

  return (
    <Group>
      <Button onClick={!approved ? openModal : () => {}} color={approved ? 'green' : ''} rightSection={approved ? <IconCheck /> : null} disabled={disabled}>
        {approved ? 'Approved' : 'Approve'}
      </Button>
    </Group>
  );
}
