import { Content } from '@components/note/content';
import { RootNote } from '@components/note/root';

import destr from 'destr';
import { useRouter } from 'next/router';
import { memo, useMemo, useRef } from 'react';

export const Note = memo(function Note({ event }: { event: any }) {
  const router = useRouter();
  const tags = destr(event.tags);
  const rootEventID = useRef(null);

  const fetchRootEvent = useMemo(() => {
    if (tags.length > 0) {
      if (tags[0][0] === 'e' || tags[0][2] === 'root') {
        rootEventID.current = tags[0][1];
        return <RootNote id={tags[0][1]} />;
      } else {
        tags.every((tag) => {
          if (tag[0] === 'e' && tag[2] === 'root') {
            rootEventID.current = tag[1];
            return <RootNote id={tag[1]} />;
          }
          return <></>;
        });
      }
    } else {
      return <></>;
    }
  }, [tags]);

  const openThread = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      router.push(`/newsfeed/${rootEventID.current || event.id}`);
    } else {
      e.stopPropagation();
    }
  };

  return (
    <div
      onClick={(e) => openThread(e)}
      className="relative z-10 flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 py-5 px-3 hover:bg-black/20"
    >
      <>{fetchRootEvent}</>
      <Content data={event} />
    </div>
  );
});
