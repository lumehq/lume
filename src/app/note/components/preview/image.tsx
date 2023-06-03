import { Image } from "@shared/image";
import useEmblaCarousel from "embla-carousel-react";

export function ImagePreview({ urls }: { urls: string[] }) {
	const [emblaRef] = useEmblaCarousel();

	return (
		<div ref={emblaRef} className="mt-3 overflow-hidden">
			<div className="flex">
				{urls.map((url) => (
					<div key={url} className="mr-2 min-w-0 grow-0 shrink-0 basis-full">
						<Image
							src={url}
							alt="image"
							className="h-auto w-full rounded-lg object-cover"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
