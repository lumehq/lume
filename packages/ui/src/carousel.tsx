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
	readonly isSnapPoint: boolean;
}

export const Carousel = <T extends any>({
	items,
	renderItem,
}: CarouselProps<T>) => {
	const {
		scrollRef,
		pages,
		activePageIndex,
		prev,
		next,
		goTo,
		snapPointIndexes,
	} = useSnapCarousel();
	return (
		<div className="group relative">
			<ul
				ref={scrollRef}
				className="relative flex overflow-auto snap-x scrollbar-none"
			>
				{items.map((item, i) =>
					renderItem({
						item,
						isSnapPoint: snapPointIndexes.has(i),
					}),
				)}
			</ul>
			<div
				aria-hidden
				className="hidden group-hover:flex z-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full justify-between items-center px-5"
			>
				<button
					className={cn(
						"size-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white",
						activePageIndex <= 0 ? "opacity-50" : "",
					)}
					onClick={() => prev()}
				>
					<ArrowLeftIcon className="size-6" />
				</button>
				<button
					className={cn(
						"size-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white",
						activePageIndex <= 0 ? "opacity-50" : "",
					)}
					onClick={() => next()}
				>
					<ArrowRightIcon className="size-6" />
				</button>
			</div>
			<div className="absolute top-3 right-3 flex justify-center bg-black mix-blend-multiply bg-opacity-20 backdrop-blur-sm h-6 w-12 items-center rounded-full text-sm font-medium text-white">
				{activePageIndex + 1} / {pages.length}
			</div>
		</div>
	);
};

interface CarouselItemProps {
	readonly isSnapPoint: boolean;
	readonly children?: React.ReactNode;
}

export const CarouselItem = ({ isSnapPoint, children }: CarouselItemProps) => (
	<li
		className={cn(
			"w-[240px] h-[320px] shrink-0 pl-3 last:pr-2",
			isSnapPoint ? "" : "snap-start",
		)}
	>
		{children}
	</li>
);
