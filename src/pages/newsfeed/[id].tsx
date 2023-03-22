import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { DatabaseContext } from '@components/contexts/database';
import { Content } from '@components/note/content';
import FormComment from '@components/note/form/comment';

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
  const router = useRouter();
  const { db }: any = useContext(DatabaseContext);

  const id = router.query.id;
  const [root, setRoot] = useState(null);

  const fetchRoot = useCallback(async () => {
    const result = await db.select(`SELECT * FROM cache_notes WHERE id = "${id}"`);
    setRoot(result[0]);
  }, [db, id]);

  useEffect(() => {
    fetchRoot().catch(console.error);
  }, [fetchRoot]);

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-auto py-5">
      <div className="flex h-min min-h-min w-full select-text flex-col px-3">{root && <Content data={root} />}</div>
      <div>
        <FormComment />
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
