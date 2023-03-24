import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { Content } from '@components/note/content';
import { ContentExtend } from '@components/note/content/extend';
import FormComment from '@components/note/form/comment';
import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { getNoteByID } from '@utils/storage';

import { useAtomValue } from 'jotai';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
  useEffect,
  useState,
} from 'react';

export default function Page() {
  const pool: any = useContext(RelayContext);

  const router = useRouter();
  const id = router.query.id || null;

  const relays: any = useAtomValue(relaysAtom);

  const [rootEvent, setRootEvent] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe: () => void;

    getNoteByID(id)
      .then((res) => {
        // update state
        setRootEvent(res);
        // get all comments
        unsubscribe = pool.subscribe(
          [
            {
              '#e': [id],
              kinds: [1],
            },
          ],
          relays,
          (event: any) => {
            setComments((comments) => [...comments, event]);
          }
        );
      })
      .catch(console.error);

    return () => {
      unsubscribe();
    };
  }, [id, pool, relays]);

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-auto py-5">
      <div className="flex h-min min-h-min w-full select-text flex-col px-3">
        {rootEvent && <ContentExtend data={rootEvent} />}
      </div>
      <div>
        <FormComment eventID={id} />
      </div>
      <div className="flex flex-col">
        {comments.length > 0 &&
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 px-3 py-5 hover:bg-black/20"
            >
              <Content data={comment} />
            </div>
          ))}
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
