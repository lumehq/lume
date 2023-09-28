import { Handle, Position } from 'reactflow';

import { User } from '@shared/user';

export function UserNode({ data }) {
  return (
    <>
      <div className="relative mx-3 my-3 inline-flex h-12 w-12 shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-8 w-8 animate-ping rounded-lg bg-green-400 opacity-75"></span>
        <div className="relative z-10">
          <User pubkey={data.pubkey} variant="avatar" />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2 w-2 rounded-full border-none !bg-white/20"
      />
    </>
  );
}
