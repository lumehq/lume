import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';

export function VideoPreview({ urls }: { urls: string[] }) {
  return (
    <div className="relative mt-3 flex w-full flex-col gap-2">
      {urls.map((url) => (
        <MediaPlayer
          key={url}
          src={url}
          load="visible"
          aspectRatio="16/9"
          crossorigin=""
          className="player"
        >
          <MediaProvider>
            <Poster
              className="vds-poster"
              src="https://thumbnail.video/api/get?url=${url}&seconds=1"
              alt={url}
            />
          </MediaProvider>
          <DefaultAudioLayout icons={defaultLayoutIcons} />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      ))}
    </div>
  );
}
