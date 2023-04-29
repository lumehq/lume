import { MediaOutlet, MediaPlayer } from '@vidstack/react';

export default function VideoPreview({ url, size }: { url: string; size: string }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative mt-2 flex flex-col overflow-hidden rounded-lg ${size === 'large' ? 'w-4/5' : 'w-2/3'}`}
    >
      <MediaPlayer src={url} poster="" controls>
        <MediaOutlet />
      </MediaPlayer>
    </div>
  );
}
