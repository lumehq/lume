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
		<div className="mt-1 mb-2.5 w-full rounded-xl overflow-hidden">
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
				</MediaControlBar>
			</MediaController>
		</div>
	);
}
