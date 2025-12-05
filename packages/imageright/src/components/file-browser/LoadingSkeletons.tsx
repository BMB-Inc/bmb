import { Skeleton } from '@mantine/core';

export default function LoadingSkeletons() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={`skeleton-${i}`} height={12} width={i % 2 === 0 ? '60%' : '40%'} radius="sm" />
      ))}
    </>
  );
}


