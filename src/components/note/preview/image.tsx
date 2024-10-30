import { settingsQueryOptions } from "@/routes/__root";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function ImagePreview({ url }: { url: string }) {
	const settings = useSuspenseQuery(settingsQueryOptions);

	const imageUrl = useMemo(() => {
		if (settings.data.resize_service) {
			const newUrl = `https://wsrv.nl?url=${url}&ll&af&default=1&n=-1`;
			return newUrl;
		} else {
			return url;
		}
	}, [settings.data.resize_service]);

	if (!settings.data.display_media) {
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
			<img
				src={imageUrl}
				alt={url}
				loading="lazy"
				decoding="async"
				style={{ contentVisibility: "auto" }}
				className="max-h-[400px] w-full h-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
			/>
		</div>
	);
}
