import { Content } from '@components/note/content';
import { RootNote } from '@components/note/root';

import destr from 'destr';
import { memo, useMemo } from 'react';

export const Note = memo(function Note({ event }: { event: any }) {
  const tags = destr(event.tags);

  const fetchRootEvent = useMemo(() => {
    if (tags.length > 0) {
      if (tags[0][0] === 'e' || tags[0][2] === 'root') {
        return <RootNote id={tags[0][1]} />;
      } else {
        tags.every((tag) => {
          if (tag[0] === 'e' && tag[2] === 'root') {
            return <RootNote id={tags[1]} />;
          }
          return <></>;
        });
      }
    } else {
      return <></>;
    }
  }, [tags]);

  return (
    <div className="relative z-10 flex h-min min-h-min w-full cursor-pointer select-text flex-col border-b border-zinc-800 py-5 px-3 hover:bg-black/20">
      <>{fetchRootEvent}</>
      <Content data={event} />
    </div>
  );
});
