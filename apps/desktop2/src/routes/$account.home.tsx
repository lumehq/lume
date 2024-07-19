import { Column } from "@/components/column";
import { Toolbar } from "@/components/toolbar";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import type { ColumnEvent, LumeColumn } from "@lume/types";
import { createFileRoute } from "@tanstack/react-router";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
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
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const emitScrollEvent = useCallback(() => {
		getCurrentWindow().emit("child_webview", { scroll: true });
	}, []);

	const emitResizeEvent = useCallback(() => {
		getCurrentWindow().emit("child_webview", { resize: true, direction: "x" });
	}, []);

	const openLumeStore = useCallback(async () => {
		await getCurrentWindow().emit("columns", {
			type: "add",
			column: {
				label: "store",
				name: "Column Gallery",
				content: "/store",
			},
		});
	}, []);

	const add = useDebouncedCallback((column: LumeColumn) => {
		column.label = `${column.label}-${nanoid()}`; // update col label
		setColumns((prev) => [column, ...prev]);
	}, 150);

	const remove = useDebouncedCallback((label: string) => {
		setColumns((prev) => prev.filter((t) => t.label !== label));
	}, 150);

	const move = useDebouncedCallback(
		(label: string, direction: "left" | "right") => {
			const newCols = [...columns];

			const col = newCols.find((el) => el.label === label);
			const colIndex = newCols.findIndex((el) => el.label === label);

			newCols.splice(colIndex, 1);

			if (direction === "left") newCols.splice(colIndex - 1, 0, col);
			if (direction === "right") newCols.splice(colIndex + 1, 0, col);

			setColumns(newCols);
		},
		150,
	);

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
				if (emblaApi) emblaApi.scrollPrev();
				break;
			case "ArrowRight":
				if (emblaApi) emblaApi.scrollNext();
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
			if (data.payload.type === "move")
				move(data.payload.label, data.payload.direction);
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
					<div className="shrink-0 p-2 h-full w-[480px]">
						<div className="size-full bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center">
							<button
								type="button"
								onClick={() => openLumeStore()}
								className="inline-flex items-center justify-center gap-0.5 rounded-full text-sm font-medium h-8 w-max pl-1.5 pr-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
							>
								<PlusIcon className="size-5" />
								Add Column
							</button>
						</div>
					</div>
				</div>
			</div>
			<Toolbar>
				<button
					type="button"
					onClick={() => scrollPrev()}
					className="inline-flex items-center justify-center rounded-full size-8 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowLeftIcon className="size-4" />
				</button>
				<button
					type="button"
					onClick={() => scrollNext()}
					className="inline-flex items-center justify-center rounded-full size-8 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowRightIcon className="size-4" />
				</button>
			</Toolbar>
		</div>
	);
}
