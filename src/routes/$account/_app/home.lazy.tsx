import { appColumns } from "@/commons";
import { Spinner } from "@/components";
import { Column } from "@/components/column";
import { LumeWindow } from "@/system";
import type { ColumnEvent, LumeColumn } from "@/types";
import { ArrowLeft, ArrowRight, Plus, StackPlus } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { listen } from "@tauri-apps/api/event";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { resolveResource } from "@tauri-apps/api/path";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";
import useEmblaCarousel from "embla-carousel-react";
import { nanoid } from "nanoid";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useDebouncedCallback } from "use-debounce";

export const Route = createLazyFileRoute("/$account/_app/home")({
	component: Screen,
});

function Screen() {
	const columns = useStore(appColumns, (state) => state);

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
		getCurrentWindow().emit("child_webview", { scroll: true });
	}, []);

	const emitResizeEvent = useCallback(() => {
		getCurrentWindow().emit("child_webview", { resize: true, direction: "x" });
	}, []);

	const add = useDebouncedCallback((column: LumeColumn) => {
		column.label = `${column.label}-${nanoid()}`; // update col label
		appColumns.setState((prev) => [column, ...prev]);
	}, 150);

	const remove = useDebouncedCallback((label: string) => {
		appColumns.setState((prev) => prev.filter((t) => t.label !== label));
	}, 150);

	const move = useDebouncedCallback(
		(label: string, direction: "left" | "right") => {
			const newCols = [...columns];

			const col = newCols.find((el) => el.label === label);
			const colIndex = newCols.findIndex((el) => el.label === label);

			newCols.splice(colIndex, 1);

			if (direction === "left") newCols.splice(colIndex - 1, 0, col);
			if (direction === "right") newCols.splice(colIndex + 1, 0, col);

			appColumns.setState(() => newCols);
		},
		150,
	);

	const update = useDebouncedCallback((label: string, title: string) => {
		const currentColIndex = columns.findIndex((col) => col.label === label);

		const updatedCol = Object.assign({}, columns[currentColIndex]);
		updatedCol.name = title;

		const newCols = columns.slice();
		newCols[currentColIndex] = updatedCol;

		appColumns.setState(() => newCols);
	}, 150);

	const reset = useDebouncedCallback(() => appColumns.setState(() => []), 150);

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
				update(data.payload.label, data.payload.title);
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	useEffect(() => {
		async function getSystemColumns() {
			const systemPath = "resources/columns.json";
			const resourcePath = await resolveResource(systemPath);
			const resourceFile = await readTextFile(resourcePath);
			const cols: LumeColumn[] = JSON.parse(resourceFile);

			appColumns.setState(() => cols.filter((col) => col.default));
		}

		if (!columns.length) {
			getSystemColumns();
		}
	}, [columns.length]);

	return (
		<div className="size-full">
			<div ref={emblaRef} className="overflow-hidden size-full">
				<div className="flex size-full">
					{!columns ? (
						<div className="size-full flex items-center justify-center">
							<Spinner />
						</div>
					) : (
						columns.map((column) => (
							<Column key={column.label} column={column} />
						))
					)}
					<div className="shrink-0 p-2 h-full w-[440px]">
						<div className="size-full flex items-center justify-center">
							<button
								type="button"
								onClick={() => LumeWindow.openColumnsGallery()}
								className="inline-flex items-center justify-center gap-1 rounded-full text-sm font-medium h-8 w-max pl-2 pr-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
							>
								<Plus className="size-4" />
								Add Column
							</button>
						</div>
					</div>
				</div>
			</div>
			<Toolbar>
				<ManageButton />
				<button
					type="button"
					onClick={() => scrollPrev()}
					className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowLeft className="size-4" />
				</button>
				<button
					type="button"
					onClick={() => scrollNext()}
					className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowRight className="size-4" />
				</button>
			</Toolbar>
		</div>
	);
}

function ManageButton() {
	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Open Launchpad",
				action: () => LumeWindow.openColumnsGallery(),
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: "Open Newsfeed",
				action: () => LumeWindow.openLocalFeeds(),
			}),
			MenuItem.new({
				text: "Open Notification",
				action: () => LumeWindow.openNotification(),
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
		>
			<StackPlus className="size-4" />
		</button>
	);
}

function Toolbar({ children }: { children: ReactNode[] }) {
	const [domReady, setDomReady] = useState(false);

	useLayoutEffect(() => {
		setDomReady(true);
	}, []);

	return domReady ? (
		// @ts-ignore, react bug ???
		createPortal(children, document.getElementById("toolbar"))
	) : (
		<></>
	);
}
