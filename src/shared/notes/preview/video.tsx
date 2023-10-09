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
          muted={true}
          className="player"
        >
          <MediaProvider />
          <DefaultAudioLayout
            icons={defaultLayoutIcons}
            smallLayoutWhen="(width < 500) or (height < 380)"
            noModal={true}
          />
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            smallLayoutWhen="(width < 500) or (height < 380)"
            noModal={true}
          />
        </MediaPlayer>
      ))}
    </div>
  );
}
