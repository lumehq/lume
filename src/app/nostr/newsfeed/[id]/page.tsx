'use client';

export default function Page({ params }: { params: { id: string } }) {
  return <div className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-auto py-3">{params.id}</div>;
}
