import { appSettings } from "@/commons";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";

export function ImagePreview({ url }: { url: string }) {
	const [service, visible] = useStore(appSettings, (state) => [
		state.image_resize_service,
		state.display_media,
	]);

	const imageUrl = useMemo(() => {
		if (service?.length) {
			const newUrl = `${service}?url=${url}&ll&af&default=1&n=-1`;
			return newUrl;
		} else {
			return url;
		}
	}, [service]);

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
			<img
				src={imageUrl}
				alt={url}
				loading="lazy"
				decoding="async"
				style={{ contentVisibility: "auto" }}
				className="max-h-[400px] w-full h-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
				onError={({ currentTarget }) => {
					currentTarget.onerror = null;
					currentTarget.src = "/404.jpg";
				}}
			/>
		</div>
	);
}
