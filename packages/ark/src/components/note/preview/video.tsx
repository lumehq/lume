import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
	DefaultVideoLayout,
	defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

export function VideoPreview({ url }: { url: string }) {
	return (
		<MediaPlayer
			src={url}
			className="w-full my-1 overflow-hidden rounded-lg"
			load="visible"
		>
			<MediaProvider />
			<DefaultVideoLayout icons={defaultLayoutIcons} />
		</MediaPlayer>
	);
}
