import { Carousel, CarouselItem } from "@lume/ui";

export function Videos({ urls }: { urls: string[] }) {
	if (urls.length === 1) {
		return (
			<div className="group px-3">
				<video
					className="max-h-[400px] w-auto  object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
					preload="metadata"
					controls
					muted
				>
					<source src={urls[0]} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>
		);
	}

	return (
		<Carousel
			items={urls}
			renderItem={({ item, isSnapPoint }) => (
				<CarouselItem key={item} isSnapPoint={isSnapPoint}>
					<video
						className="w-full h-full object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
						preload="metadata"
						controls={false}
						muted
					>
						<source src={item} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</CarouselItem>
			)}
		/>
	);
}
