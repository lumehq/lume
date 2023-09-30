import { MediaPlayer, MediaProvider } from '@vidstack/react';

export function VideoPreview({ urls }: { urls: string[] }) {
  return (
    <div className="relative mt-3 flex w-full flex-col gap-2">
      {urls.map((url) => (
        <MediaPlayer
          key={url}
          src={url}
          poster={`https://thumbnail.video/api/get?url=${url}&seconds=1`}
          load="visible"
          aspectRatio="16/9"
          crossorigin=""
        >
          <MediaProvider />
        </MediaPlayer>
      ))}
    </div>
  );
}
