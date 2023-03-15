import { UserMini } from '@components/user/mini';

import { Key } from 'react';

export default function Messages({ data }: { data: any }) {
  console.log(data);

  return (
    <>
      {data.map((item: string, index: Key) => (
        <UserMini key={index} pubkey={item} />
      ))}
    </>
  );
}
