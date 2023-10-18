import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/dist/react';
import { memo } from 'react';

export const VideoPreview = memo(function VideoPreview({ urls }: { urls: string[] }) {
  return (
    <div className="my-2 flex flex-col gap-2">
      {urls.map((url) => (
        <MediaController key={url} className="aspect-video overflow-hidden rounded-lg">
          <video
            slot="media"
            src={url}
            poster={`https://thumbnail.video/api/get?url=${url}&seconds=1`}
            preload="auto"
            muted
          />
          <MediaControlBar>
            <MediaPlayButton></MediaPlayButton>
            <MediaTimeRange></MediaTimeRange>
            <MediaTimeDisplay showDuration></MediaTimeDisplay>
            <MediaMuteButton></MediaMuteButton>
            <MediaVolumeRange></MediaVolumeRange>
          </MediaControlBar>
        </MediaController>
      ))}
    </div>
  );
});
