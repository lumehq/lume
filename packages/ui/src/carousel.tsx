import { ArrowLeftIcon, ArrowRightIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useSnapCarousel } from "react-snap-carousel";

interface CarouselProps<T> {
	readonly items: T[];
	readonly renderItem: (
		props: CarouselRenderItemProps<T>,
	) => React.ReactElement<CarouselItemProps>;
}

interface CarouselRenderItemProps<T> {
	readonly item: T;
	readonly index: number;
	readonly isSnapPoint: boolean;
}

export const Carousel = <T,>({ items, renderItem }: CarouselProps<T>) => {
	const { scrollRef, pages, activePageIndex, prev, next, snapPointIndexes } =
		useSnapCarousel();

	return (
		<div className="relative group">
			<ul
				ref={scrollRef}
				className="relative flex overflow-auto snap-x scrollbar-none"
			>
				{items.map((item, index) =>
					renderItem({
						item,
						index,
						isSnapPoint: snapPointIndexes.has(index),
					}),
				)}
			</ul>
			<div
				aria-hidden
				className="absolute z-10 items-center justify-between hidden w-full px-5 transform -translate-x-1/2 -translate-y-1/2 group-hover:flex left-1/2 top-1/2"
			>
				<button
					type="button"
					className={cn(
						"size-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white",
						activePageIndex <= 0 ? "opacity-50" : "",
					)}
					onClick={() => prev()}
				>
					<ArrowLeftIcon className="size-6" />
				</button>
				<button
					type="button"
					className={cn(
						"size-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white",
						activePageIndex <= 0 ? "opacity-50" : "",
					)}
					onClick={() => next()}
				>
					<ArrowRightIcon className="size-6" />
				</button>
			</div>
			<div className="absolute flex items-center justify-center w-12 h-6 text-sm font-medium text-white bg-black rounded-full top-3 right-3 mix-blend-multiply bg-opacity-20 backdrop-blur-sm">
				{activePageIndex + 1} / {pages.length}
			</div>
		</div>
	);
};

interface CarouselItemProps {
	readonly isSnapPoint: boolean;
	readonly children?: React.ReactNode;
}

export const CarouselItem = ({ isSnapPoint, children }: CarouselItemProps) => {
	return (
		<li
			className={cn(
				"w-[240px] h-[320px] shrink-0 pl-3 last:pr-2",
				isSnapPoint ? "" : "snap-start",
			)}
		>
			{children}
		</li>
	);
};
