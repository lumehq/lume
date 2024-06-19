import { Carousel, CarouselItem } from "@lume/ui";
import { useRouteContext } from "@tanstack/react-router";
import { open } from "@tauri-apps/plugin-shell";
import { useMemo } from "react";

export function Images({ urls }: { urls: string[] }) {
	const { settings } = useRouteContext({ strict: false });

	const imageUrls = useMemo(() => {
		if (settings.image_resize_service.length) {
			const newUrls = urls.map(
				(url) =>
					`${settings.image_resize_service}?url=${url}&ll&af&default=1&n=-1`,
			);
			return newUrls;
		} else {
			return urls;
		}
	}, [settings.image_resize_service]);

	if (urls.length === 1) {
		return (
			<div className="px-3 group">
				<img
					src={imageUrls[0]}
					alt={urls[0]}
					loading="lazy"
					decoding="async"
					style={{ contentVisibility: "auto" }}
					className="max-h-[400px] w-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
					onClick={() => urls[0]}
					onKeyDown={() => urls[0]}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src = "/404.jpg";
					}}
				/>
			</div>
		);
	}

	return (
		<Carousel
			items={imageUrls}
			renderItem={({ item, isSnapPoint }) => (
				<CarouselItem key={item} isSnapPoint={isSnapPoint}>
					<img
						src={item}
						alt={item}
						loading="lazy"
						decoding="async"
						style={{ contentVisibility: "auto" }}
						className="object-cover w-full h-full rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
						onClick={() => open(item)}
						onKeyDown={() => open(item)}
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = "/404.jpg";
						}}
					/>
				</CarouselItem>
			)}
		/>
	);
}
