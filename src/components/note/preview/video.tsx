import { settingsQueryOptions } from "@/routes/__root";
import { useSuspenseQuery } from "@tanstack/react-query";

export function VideoPreview({ url }: { url: string }) {
	const settings = useSuspenseQuery(settingsQueryOptions);

	if (!settings.data.display_zap_button) {
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
