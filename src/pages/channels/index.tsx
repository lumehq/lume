import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { RelayContext } from '@components/relaysProvider';

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
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [40],
          since: 0,
        },
      ],
      relays,
      (event: any) => {
        setList((list) => [event, ...list]);
      }
    );

    return () => {
      unsubscribe;
    };
  }, [pool, relays]);

  return (
    <div className="h-full w-full overflow-y-auto">
      {list.map((channel) => (
        <div key={channel.id}>{channel.content}</div>
      ))}
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
