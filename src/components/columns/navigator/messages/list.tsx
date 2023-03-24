import { UserMini } from '@components/user/mini';

import { Key, memo } from 'react';

export const MessageList = memo(function MessageList({ data }: { data: any }) {
  return (
    <>
      {data.map((item: { pubkey: string }, index: Key) => (
        <UserMini key={index} pubkey={item.pubkey} />
      ))}
    </>
  );
});
