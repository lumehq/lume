import { Handle, Position } from 'reactflow';

import { UserWithDrawer } from '@app/browse/components/userWithDrawer';

import { GroupTitle } from './groupTitle';

export function UserGroupNode({ data }) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="h-2 w-5 rounded-full border-none !bg-fuchsia-400"
      />
      <div className="relative mx-3 my-3 flex flex-col gap-1">
        {data.title ? (
          <h3 className="text-sm font-semibold text-fuchsia-500">{data.title}</h3>
        ) : (
          <GroupTitle pubkey={data.pubkey} />
        )}
        <div className="grid grid-cols-5 gap-6 rounded-lg border border-fuchsia-500/50 bg-fuchsia-500/10 p-4">
          {data.list.map((user: string) => (
            <UserWithDrawer key={user} pubkey={user} />
          ))}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2 w-5 rounded-full border-none !bg-fuchsia-400"
      />
    </>
  );
}
