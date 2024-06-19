import { Column } from "@/components/column";
import { Toolbar } from "@/components/toolbar";
import { ArrowLeftIcon, ArrowRightIcon, PlusSquareIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import type { ColumnEvent, LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import useEmblaCarousel from "embla-carousel-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const Route = createFileRoute("/$account/home")({
	loader: async () => {
		const columns = await NostrQuery.getColumns();
		return columns;
	},
	component: Screen,
});

function Screen() {
	const { account } = Route.useParams();
	const initialColumnList = Route.useLoaderData();

	const [columns, setColumns] = useState<LumeColumn[]>([]);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		watchDrag: false,
		loop: false,
	});

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev(true);
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext(true);
	}, [emblaApi]);

	const emitScrollEvent = useCallback(() => {
		getCurrent().emit("child-webview", { scroll: true });
	}, []);

	const emitResizeEvent = useCallback(() => {
		getCurrent().emit("child-webview", { resize: true, direction: "x" });
	}, []);

	const openLumeStore = useDebouncedCallback(async () => {
		await getCurrent().emit("columns", {
			type: "add",
			column: {
				label: "store",
				name: "Store",
				content: "/store/official",
			},
		});
	}, 150);

	const add = useDebouncedCallback((column: LumeColumn) => {
		column.label = `${column.label}-${nanoid()}`; // update col label
		setColumns((prev) => [column, ...prev]);
	}, 150);

	const remove = useDebouncedCallback((label: string) => {
		setColumns((prev) => prev.filter((t) => t.label !== label));
	}, 150);

	const updateName = useDebouncedCallback((label: string, title: string) => {
		const currentColIndex = columns.findIndex((col) => col.label === label);

		const updatedCol = Object.assign({}, columns[currentColIndex]);
		updatedCol.name = title;

		const newCols = columns.slice();
		newCols[currentColIndex] = updatedCol;

		setColumns(newCols);
	}, 150);

	const reset = useDebouncedCallback(() => setColumns([]), 150);

	const handleKeyDown = useDebouncedCallback((event) => {
		if (event.defaultPrevented) return;

		switch (event.code) {
			case "ArrowLeft":
				if (emblaApi) emblaApi.scrollPrev(true);
				break;
			case "ArrowRight":
				if (emblaApi) emblaApi.scrollNext(true);
				break;
			default:
				break;
		}

		event.preventDefault();
	}, 150);

	useEffect(() => {
		if (emblaApi) {
			emblaApi.on("scroll", emitScrollEvent);
			emblaApi.on("resize", emitResizeEvent);
			emblaApi.on("slidesChanged", emitScrollEvent);
		}

		return () => {
			emblaApi?.off("scroll", emitScrollEvent);
			emblaApi?.off("resize", emitResizeEvent);
			emblaApi?.off("slidesChanged", emitScrollEvent);
		};
	}, [emblaApi, emitScrollEvent, emitResizeEvent]);

	useEffect(() => {
		if (columns?.length) {
			NostrQuery.setColumns(columns).then(() => console.log("saved"));
		}
	}, [columns]);

	useEffect(() => {
		setColumns(initialColumnList);
	}, [initialColumnList]);

	// Listen for keyboard event
	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	// Listen for columns event
	useEffect(() => {
		const unlisten = listen<ColumnEvent>("columns", (data) => {
			if (data.payload.type === "reset") reset();
			if (data.payload.type === "add") add(data.payload.column);
			if (data.payload.type === "remove") remove(data.payload.label);
			if (data.payload.type === "set_title")
				updateName(data.payload.label, data.payload.title);
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return (
		<div className="size-full">
			<div ref={emblaRef} className="overflow-hidden size-full">
				<div className="flex size-full">
					{columns?.map((column) => (
						<Column
							key={account + column.label}
							column={column}
							account={account}
						/>
					))}
				</div>
			</div>
			<Toolbar>
				<div className="flex items-center h-8 gap-1 p-[2px] rounded-full bg-black/5 dark:bg-white/5">
					<button
						type="button"
						onClick={() => scrollPrev()}
						className="inline-flex items-center justify-center rounded-full size-7 text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
					>
						<ArrowLeftIcon className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => openLumeStore()}
						className="inline-flex items-center justify-center rounded-full size-7 text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
					>
						<PlusSquareIcon className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => scrollNext()}
						className="inline-flex items-center justify-center rounded-full size-7 text-neutral-800 hover:bg-black/10 dark:text-neutral-200 dark:hover:bg-white/10"
					>
						<ArrowRightIcon className="size-4" />
					</button>
				</div>
			</Toolbar>
		</div>
	);
}
