'use client';

import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('event-id');

  return <div className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-auto py-3">{id}</div>;
}
