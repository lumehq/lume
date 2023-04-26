import { AccountContext } from '@components/accountProvider';
import { MessageListItem } from '@components/chats/messageListItem';
import FormChat from '@components/form/chat';
import NewsfeedLayout from '@components/layouts/newsfeed';
import { RelayContext } from '@components/relaysProvider';

import { FULL_RELAYS } from '@stores/constants';

import { usePageContext } from '@utils/hooks/usePageContext';
import { sortMessages } from '@utils/transform';

import { useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const pubkey = searchParams.pubkey;

  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const { data, error } = useSWRSubscription(
    pubkey
      ? [
          {
            kinds: [4],
            authors: [pubkey],
            '#p': [activeAccount.pubkey],
          },
          {
            kinds: [4],
            authors: [activeAccount.pubkey],
            '#p': [pubkey],
          },
        ]
      : null,
    (key, { next }) => {
      const unsubscribe = pool.subscribe(key, FULL_RELAYS, (event: any) => {
        next(null, (prev) => (prev ? [event, ...prev] : [event]));
      });

      return () => {
        unsubscribe();
      };
    }
  );

  return (
    <NewsfeedLayout>
      <div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
        <div className="scrollbar-hide flex h-full w-full flex-col-reverse overflow-y-auto">
          {error && <div>failed to load</div>}
          {!data ? (
            <div className="flex h-min min-h-min w-full animate-pulse select-text flex-col px-5 py-2 hover:bg-black/20">
              <div className="flex flex-col">
                <div className="group flex items-start gap-3">
                  <div className="bg-zinc relative h-9 w-9 shrink rounded-md bg-zinc-700"></div>
                  <div className="flex w-full flex-1 items-start justify-between">
                    <div className="flex items-baseline gap-2 text-sm">
                      <span className="h-2 w-16 bg-zinc-700"></span>
                    </div>
                  </div>
                </div>
                <div className="-mt-[17px] pl-[48px]">
                  <div className="h-3 w-full bg-zinc-700"></div>
                </div>
              </div>
            </div>
          ) : (
            sortMessages(data).map((message) => (
              <MessageListItem
                key={message.id}
                data={message}
                userPubkey={activeAccount.pubkey}
                userPrivkey={activeAccount.privkey}
              />
            ))
          )}
        </div>
        <div className="shrink-0 p-3">
          <FormChat receiverPubkey={pubkey} />
        </div>
      </div>
    </NewsfeedLayout>
  );
}
