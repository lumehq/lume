import { MediaOutlet, MediaPlayer } from '@vidstack/react';

export const VideoPreview = ({ url }: { url: string }) => {
  return (
    <div onClick={(e) => e.stopPropagation()} className="relative mt-2 flex flex-col overflow-hidden rounded-lg">
      <MediaPlayer src={url} poster="" controls>
        <MediaOutlet />
      </MediaPlayer>
    </div>
  );
};
