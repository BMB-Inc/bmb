import { Card } from '@mantine/core';
import type { ReactNode } from 'react';

export function BrowserShell({ children }: { children: ReactNode }) {
  return <Card withBorder>{children}</Card>;
}

export default BrowserShell;



