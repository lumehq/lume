import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { NoteBase } from '@components/note/base';
import FormBasic from '@components/note/form/basic';
import { Placeholder } from '@components/note/placeholder';

import { notesAtom } from '@stores/note';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useAtom } from 'jotai';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, Suspense, useRef } from 'react';

export default function Page() {
  const [data]: any = useAtom(notesAtom);
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    overscan: 5,
    estimateSize: () => 600,
    getScrollElement: () => parentRef.current,
    getItemKey: (index) => data[index].id,
  });
  const items = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="scrollbar-hide h-full w-full overflow-y-auto" style={{ contain: 'strict' }}>
      <div className="relative">
        <FormBasic />
      </div>
      <Suspense fallback={<Placeholder />}>
        <div>
          {items.length > 0 && (
            <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
              <div className="absolute top-0 left-0 w-full" style={{ transform: `translateY(${items[0].start}px)` }}>
                {items.map((virtualRow) => (
                  <div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
                    <NoteBase event={data[virtualRow.index]} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Suspense>
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
