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
    <div className="my-1 w-full overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/5">
      <MediaController>
        <video
          slot="media"
          src={url}
          preload="auto"
          muted
          className="h-auto w-full rounded-xl"
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
