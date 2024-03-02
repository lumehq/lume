import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
} from "media-chrome/dist/react";

export function VideoPreview({ url }: { url: string }) {
  return (
    <div className="my-1">
      <MediaController>
        <video
          slot="media"
          src={url}
          preload="auto"
          muted
          className="h-auto w-full"
        />
        <MediaControlBar>
          <MediaPlayButton />
          <MediaTimeRange />
          <MediaTimeDisplay showDuration />
          <MediaMuteButton />
        </MediaControlBar>
      </MediaController>
    </div>
  );
}
