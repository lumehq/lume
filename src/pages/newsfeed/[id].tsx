import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import FormComment from '@components/form/comment';
import { NoteComment } from '@components/note/comment';
import { NoteExtend } from '@components/note/extend';
import { RelayContext } from '@components/relaysProvider';

import { getAllCommentNotes, getNoteByID } from '@utils/storage';

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
  const [pool, relays]: any = useContext(RelayContext);

  const router = useRouter();
  const id = router.query.id || null;

  const [rootEvent, setRootEvent] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getNoteByID(id)
      .then((res) => {
        setRootEvent(res);
        getAllCommentNotes(id).then((res: any) => setComments(res));
      })
      .catch(console.error);
  }, [id, pool, relays]);

  return (
    <div className="scrollbar-hide flex h-full flex-col gap-2 overflow-y-auto py-3">
      <div className="flex h-min min-h-min w-full select-text flex-col px-3">
        {rootEvent && <NoteExtend event={rootEvent} />}
      </div>
      <div>
        <FormComment eventID={id} />
      </div>
      <div className="flex flex-col">
        {comments.length > 0 && comments.map((comment) => <NoteComment key={comment.id} event={comment} />)}
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
