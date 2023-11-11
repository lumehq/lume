import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaLoadingIndicator,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeRange,
} from 'media-chrome/dist/react';

export function VideoPreview({ url }: { url: string }) {
  return (
    <MediaController
      key={url}
      className="my-2 aspect-video w-full overflow-hidden rounded-lg"
    >
      <video slot="media" src={url} preload="metadata" muted />
      <MediaLoadingIndicator slot="centered-chrome"></MediaLoadingIndicator>
      <MediaControlBar>
        <MediaPlayButton></MediaPlayButton>
        <MediaTimeRange></MediaTimeRange>
        <MediaMuteButton></MediaMuteButton>
        <MediaFullscreenButton></MediaFullscreenButton>
      </MediaControlBar>
    </MediaController>
  );
}
