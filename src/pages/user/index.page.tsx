import NewsfeedLayout from '@components/layouts/newsfeed';

import { usePageContext } from '@utils/hooks/usePageContext';

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const pubkey = searchParams.pubkey;

  return (
    <NewsfeedLayout>
      <div className="scrollbar-hide h-full w-full overflow-y-auto">
        <p>{pubkey}</p>
      </div>
    </NewsfeedLayout>
  );
}
