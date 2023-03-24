import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { Note } from '@components/note';
import FormBasic from '@components/note/form/basic';

import { hasNewerNoteAtom, notesAtom } from '@stores/note';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useAtom } from 'jotai';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useRef } from 'react';

export default function Page() {
  const [data]: any = useAtom(notesAtom);
  const [hasNewerNote, setHasNewerNote] = useAtom(hasNewerNoteAtom);

  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    overscan: 5,
    estimateSize: () => 600,
    getScrollElement: () => parentRef.current,
    getItemKey: (index) => data[index].id,
  });
  const items = virtualizer.getVirtualItems();

  const loadNewest = () => {
    console.log('load');
  };

  return (
    <div ref={parentRef} className="scrollbar-hide h-full w-full overflow-y-auto" style={{ contain: 'strict' }}>
      <div>
        {hasNewerNote && (
          <div className="absolute top-8 left-1/2 z-50 -translate-x-1/2 transform">
            <button
              onClick={() => loadNewest()}
              className="inline-flex h-8 transform items-center justify-center gap-1 rounded-full bg-fuchsia-500 px-3 text-sm shadow-lg shadow-fuchsia-900/50 active:translate-y-1"
            >
              <span className="text-white drop-shadow">Load newest</span>
            </button>
          </div>
        )}
      </div>
      <div>
        <FormBasic />
      </div>
      <div>
        {items.length > 0 && (
          <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
            <div className="absolute top-0 left-0 w-full" style={{ transform: `translateY(${items[0].start}px)` }}>
              {items.map((virtualRow) => (
                <div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement}>
                  <Note event={data[virtualRow.index]} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
