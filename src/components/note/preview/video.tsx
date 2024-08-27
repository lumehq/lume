import { appSettings } from "@/commons";
import { useStore } from "@tanstack/react-store";

export function VideoPreview({ url }: { url: string }) {
	const visible = useStore(appSettings, (state) => state.display_media);

	if (!visible) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noreferrer"
				className="inline text-blue-500 hover:text-blue-600"
			>
				{url}
			</a>
		);
	}

	return (
		<div className="my-1">
			<video
				className="max-h-[600px] w-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
				preload="metadata"
				controls
				muted
			>
				<source src={`${url}#t=0.1`} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
}
