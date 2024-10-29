import { commands } from "@/commands.gen";
import { appColumns, displayNpub } from "@/commons";
import { Column, Spinner } from "@/components";
import { LumeWindow } from "@/system";
import type { ColumnEvent, LumeColumn, Metadata } from "@/types";
import { ArrowLeft, ArrowRight, Plus } from "@phosphor-icons/react";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { listen } from "@tauri-apps/api/event";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import useEmblaCarousel from "embla-carousel-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useDebouncedCallback } from "use-debounce";

export const Route = createLazyFileRoute("/_app/")({
	component: Screen,
});

function Screen() {
	const initialAppColumns = Route.useLoaderData();
	const router = useRouter();
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
		getCurrentWindow().emit("scrolling", {});
	}, []);

	const remove = useCallback(
		async (label: string) => {
			const res = await commands.closeColumn(label);

			if (res.status === "ok") {
				appColumns.setState((prev) => prev.filter((t) => t.label !== label));
			} else {
				await message(res.error, { kind: "errror" });
			}
		},
		[columns],
	);

	const add = useDebouncedCallback((column: LumeColumn) => {
		const exist = columns.find((col) => col.label === column.label);

		if (!exist) {
			appColumns.setState((prev) => [column, ...prev]);

			if (emblaApi) {
				emblaApi.scrollTo(0, true);
			}
		}
	}, 150);

	const move = useDebouncedCallback(
		(label: string, direction: "left" | "right") => {
			const newCols = [...columns];
			const existColumn = newCols.find((el) => el.label === label);

			if (existColumn) {
				const colIndex = newCols.findIndex((el) => el.label === label);

				newCols.splice(colIndex, 1);

				if (direction === "left") newCols.splice(colIndex - 1, 0, existColumn);
				if (direction === "right") newCols.splice(colIndex + 1, 0, existColumn);

				appColumns.setState(() => newCols);
			}
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

	useEffect(() => {
		if (emblaApi) {
			emblaApi.on("scroll", emitScrollEvent);
			emblaApi.on("slidesChanged", emitScrollEvent);
		}

		return () => {
			emblaApi?.off("scroll", emitScrollEvent);
			emblaApi?.off("slidesChanged", emitScrollEvent);
		};
	}, [emblaApi, emitScrollEvent]);

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
		const unsubscribeFn = router.subscribe("onBeforeNavigate", async () => {
			await commands.closeAllColumns();
		});

		return () => {
			unsubscribeFn();
		};
	}, []);

	useEffect(() => {
		if (initialAppColumns) {
			appColumns.setState(() => initialAppColumns);
		}
	}, [initialAppColumns]);

	useEffect(() => {
		window.localStorage.setItem("columns", JSON.stringify(columns));
	}, [columns]);

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
					<OpenLaunchpad />
				</div>
			</div>
			<Toolbar>
				<button
					type="button"
					onClick={() => scrollPrev()}
					className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowLeft className="size-4" weight="bold" />
				</button>
				<button
					type="button"
					onClick={() => scrollNext()}
					className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowRight className="size-4" weight="bold" />
				</button>
			</Toolbar>
		</div>
	);
}

function OpenLaunchpad() {
	const { accounts } = Route.useRouteContext();

	const showContextMenu = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault();

			const list: Promise<MenuItem>[] = [];

			for (const account of accounts) {
				const res = await commands.getProfile(account);
				let name = "unknown";

				if (res.status === "ok") {
					const profile: Metadata = JSON.parse(res.data);
					name = profile.display_name ?? profile.name ?? "anon";
				}

				list.push(
					MenuItem.new({
						text: `Open Launchpad for ${name} (${displayNpub(account, 16)})`,
						action: () => LumeWindow.openLaunchpad(account),
					}),
				);
			}

			const items = await Promise.all(list);
			const menu = await Menu.new({ items });

			await menu.popup().catch((e) => console.error(e));
		},
		[accounts],
	);

	return (
		<div className="shrink-0 p-2 h-full w-[440px]">
			<div className="size-full flex items-center justify-center">
				<button
					type="button"
					onClick={(e) => showContextMenu(e)}
					className="inline-flex items-center justify-center gap-1 rounded-full text-sm font-medium h-8 w-max pl-2.5 pr-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
				>
					<Plus className="size-3" weight="bold" />
					Add Column
				</button>
			</div>
		</div>
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
