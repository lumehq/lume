import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';
import { memo } from 'react';

export const VideoPreview = memo(function VideoPreview({ urls }: { urls: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      {urls.map((url) => (
        <MediaPlayer
          key={url}
          src={url}
          poster={`https://thumbnail.video/api/get?url=${url}&seconds=1`}
          load="idle"
          aspectRatio="16/9"
          crossorigin=""
          muted={true}
          className="player"
        >
          <MediaProvider>
            <Poster
              className="vds-poster"
              src={`https://thumbnail.video/api/get?url=${url}&seconds=1`}
              alt="poster"
            />
          </MediaProvider>
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
});
