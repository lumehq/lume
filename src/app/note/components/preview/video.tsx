import { MediaOutlet, MediaPlayer } from '@vidstack/react';

export default function VideoPreview({ urls }: { urls: string[] }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative mt-2 flex w-full flex-col overflow-hidden rounded-lg bg-zinc-950"
    >
      <MediaPlayer src={urls[0]} poster="" controls>
        <MediaOutlet />
      </MediaPlayer>
    </div>
  );
}
