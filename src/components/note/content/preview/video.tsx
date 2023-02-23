import { memo } from 'react';
import ReactPlayer from 'react-player/lazy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Video = memo(function Video({ data }: { data: object }) {
  return (
    <div className="relative mt-2 flex flex-col overflow-hidden rounded-xl border border-zinc-800">
      <ReactPlayer
        url={data['url']}
        controls={true}
        volume={0}
        className="aspect-video w-full"
        width="100%"
        height="100%"
      />
    </div>
  );
});
