import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/dist/react';

export function VideoPreview({ urls }: { urls: string[] }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {urls.map((url) => (
        <MediaController key={url} className="aspect-video overflow-hidden rounded-lg">
          <video slot="media" src={url} preload="metadata" muted />
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
}
