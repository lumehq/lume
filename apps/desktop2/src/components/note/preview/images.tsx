import { Spinner } from "@lume/ui";
import { useRouteContext } from "@tanstack/react-router";
import { open } from "@tauri-apps/plugin-shell";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export function Images({ urls }: { urls: string[] }) {
	const { settings } = useRouteContext({ strict: false });

	const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, loop: true });
	const [slidesInView, setSlidesInView] = useState([]);

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

	const updateSlidesInView = useCallback((emblaApi) => {
		setSlidesInView((slidesInView) => {
			if (slidesInView.length === emblaApi.slideNodes().length) {
				emblaApi.off("slidesInView", updateSlidesInView);
			}
			const inView = emblaApi
				.slidesInView()
				.filter((index) => !slidesInView.includes(index));
			return slidesInView.concat(inView);
		});
	}, []);

	useEffect(() => {
		if (emblaApi && urls.length > 1) {
			updateSlidesInView(emblaApi);

			emblaApi.on("slidesInView", updateSlidesInView);
			emblaApi.on("reInit", updateSlidesInView);
		}

		return () => {
			emblaApi?.off("slidesInView", updateSlidesInView);
			emblaApi?.off("reInit", updateSlidesInView);
		};
	}, [emblaApi, updateSlidesInView]);

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
		<div ref={emblaRef} className="relative group">
			<div className="flex size-full scrollbar-none">
				{imageUrls.map((url, index) => (
					<LazyImage
						/* biome-ignore lint/suspicious/noArrayIndexKey: url can be duplicated */
						key={url + index}
						url={url}
						inView={slidesInView.indexOf(index) > -1}
					/>
				))}
			</div>
		</div>
	);
}

function LazyImage({ url, inView }: { url: string; inView: boolean }) {
	const [hasLoaded, setHasLoaded] = useState(false);

	const setLoaded = useCallback(() => {
		if (inView) setHasLoaded(true);
	}, [inView, setHasLoaded]);

	return (
		<div className="w-[240px] h-[320px] shrink-0 flex items-center justify-center">
			{!hasLoaded ? <Spinner className="size-4" /> : null}
			<img
				src={
					inView
						? url
						: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
				}
				data-src={url}
				alt={url}
				loading="lazy"
				decoding="async"
				style={{ contentVisibility: "auto" }}
				className="object-cover w-full h-full rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
				onClick={() => open(url)}
				onKeyDown={() => open(url)}
				onLoad={setLoaded}
				onError={({ currentTarget }) => {
					currentTarget.onerror = null;
					currentTarget.src = "/404.jpg";
				}}
			/>
		</div>
	);
}
