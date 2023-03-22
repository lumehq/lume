import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { Note } from '@components/note';

import { initialNotesAtom } from '@stores/note';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useAtom } from 'jotai';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useMemo, useRef } from 'react';

export default function Page() {
  const [data]: any = useAtom(initialNotesAtom);

  const parentRef = useRef(null);
  const count = useMemo(() => data.length, [data]);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    getItemKey: (index: number) => data[index].id,
    estimateSize: () => 500,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div className="h-full w-full">
      {items.length > 0 && (
        <div ref={parentRef} className="scrollbar-hide h-full w-full overflow-y-auto" style={{ contain: 'strict' }}>
          <div className={`relative w-full h-${virtualizer.getTotalSize()}px`}>
            <div className="absolute top-0 left-0 w-full" style={{ transform: `translateY(${items[0].start}px)` }}>
              {items.map((virtualRow) => (
                <div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
                  <Note event={data[virtualRow.index]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return (
    <BaseLayout>
      <WithSidebarLayout>{page}</WithSidebarLayout>
    </BaseLayout>
  );
};
