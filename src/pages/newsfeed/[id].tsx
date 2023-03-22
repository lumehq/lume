import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';
import { Content } from '@components/note/content';
import { ContentExtend } from '@components/note/content/extend';
import FormComment from '@components/note/form/comment';

import useLocalStorage from '@rehooks/local-storage';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export default function Page() {
  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const router = useRouter();
  const id = router.query.id;

  const [relays]: any = useLocalStorage('relays');

  const [rootEvent, setRootEvent] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchRoot = useCallback(async () => {
    const result = await db.select(`SELECT * FROM cache_notes WHERE id = "${id}"`);
    setRootEvent(result[0]);
  }, [db, id]);

  useEffect(() => {
    let unsubscribe: () => void;

    fetchRoot()
      .then(() => {
        unsubscribe = relayPool.subscribe(
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
  }, [fetchRoot, id, relayPool, relays]);

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
