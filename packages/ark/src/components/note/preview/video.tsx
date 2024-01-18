import {
	MediaControlBar,
	MediaController,
	MediaMuteButton,
	MediaPlayButton,
	MediaTimeDisplay,
	MediaTimeRange,
	MediaVolumeRange,
} from "media-chrome/dist/react";

export function VideoPreview({ url }: { url: string }) {
	return (
		<div className="my-1 w-full rounded-lg overflow-hidden">
			<MediaController>
				<video
					slot="media"
					src={url}
					preload="auto"
					muted
					className="w-full h-auto"
				/>
				<MediaControlBar>
					<MediaPlayButton />
					<MediaTimeRange />
					<MediaTimeDisplay showDuration />
					<MediaMuteButton />
					<MediaVolumeRange />
				</MediaControlBar>
			</MediaController>
		</div>
	);
}
