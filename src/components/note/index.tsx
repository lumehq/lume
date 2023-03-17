import { Content } from '@components/note/content';
import { RootNote } from '@components/note/root';

import { memo, useEffect, useState } from 'react';

export const Note = memo(function Note({ event }: { event: any }) {
  const [root, setRoot] = useState(null);
  const tags = JSON.parse(event.tags);

  useEffect(() => {
    if (tags.length > 0) {
      if (tags[0][0] === 'e') {
        setRoot(tags[0][1]);
      }
    }
  }, [tags]);

  return (
    <div className="relative z-10 flex h-min min-h-min w-full cursor-pointer select-text flex-col border-b border-zinc-800 py-5 px-3">
      {root && (
        <>
          <RootNote id={root} />
        </>
      )}
      <Content data={event} />
    </div>
  );
});
