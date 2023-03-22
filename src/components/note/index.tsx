import { Content } from '@components/note/content';
import { RootNote } from '@components/note/root';

import { memo, useMemo } from 'react';

export const Note = memo(function Note({ event }: { event: any }) {
  const tags = event.tags.replaceAll("'", '"');
  const parseTags = JSON.parse(tags);

  const fetchRootEvent = useMemo(() => {
    if (parseTags.length > 0) {
      if (parseTags[0][0] === 'e' || parseTags[0][2] === 'root') {
        return <RootNote id={parseTags[0][1]} />;
      } else {
        parseTags.every((tag) => {
          if (tag[0] === 'e' && tag[2] === 'root') {
            return <RootNote id={parseTags[1]} />;
          }
          return <></>;
        });
      }
    } else {
      return <></>;
    }
  }, [parseTags]);

  return (
    <div className="relative z-10 flex h-min min-h-min w-full cursor-pointer select-text flex-col border-b border-zinc-800 py-5 px-3 hover:bg-black/20">
      <>{fetchRootEvent}</>
      <Content data={event} />
    </div>
  );
});
