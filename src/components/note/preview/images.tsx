import { appSettings, cn } from "@/commons";
import { Spinner } from "@/components";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-store";
import { open } from "@tauri-apps/plugin-shell";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export function Images({ urls }: { urls: string[] }) {
	const [slidesInView, setSlidesInView] = useState([]);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		dragFree: true,
		align: "start",
		watchSlides: false,
	});

	const service = useStore(appSettings, (state) => state.image_resize_service);

	const imageUrls = useMemo(() => {
		if (service?.length) {
			let newUrls: string[];

			if (urls.length === 1) {
				newUrls = urls.map(
					(url) => `${service}?url=${url}&ll&af&default=1&n=-1`,
				);
			} else {
				newUrls = urls.map(
					(url) => `${service}?url=${url}&w=480&h=640&ll&af&default=1&n=-1`,
				);
			}

			return newUrls;
		} else {
			return urls;
		}
	}, [service]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

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
		<div className="relative px-3 overflow-hidden group">
			<div ref={emblaRef} className="w-full h-[320px]">
				<div className="flex w-full gap-2 scrollbar-none">
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
			<div className="absolute z-10 items-center justify-between hidden w-full px-5 transform -translate-x-1/2 -translate-y-1/2 group-hover:flex left-1/2 top-1/2">
				<button
					type="button"
					disabled={!emblaApi?.canScrollPrev}
					className={cn(
						"size-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white",
						!emblaApi?.canScrollPrev ? "opacity-50" : "",
					)}
					onClick={() => scrollPrev()}
				>
					<ArrowLeft className="size-6" />
				</button>
				<button
					type="button"
					disabled={!emblaApi?.canScrollNext}
					className={cn(
						"size-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white",
						!emblaApi?.canScrollNext ? "opacity-50" : "",
					)}
					onClick={() => scrollNext()}
				>
					<ArrowRight className="size-6" />
				</button>
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
		<div className="w-[240px] h-[320px] shrink-0 relative rounded-lg overflow-hidden">
			{!hasLoaded ? (
				<div className="flex items-center justify-center size-full bg-black/5 dark:bg-white/5">
					<Spinner className="size-4" />
				</div>
			) : null}
			<img
				src={
					inView
						? url
						: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
				}
				data-src={url}
				alt={url}
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
