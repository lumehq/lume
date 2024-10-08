import { commands } from "@/commands.gen";
import { appColumns } from "@/commons";
import type { LumeColumn } from "@/types";
import { CaretDown, Check } from "@phosphor-icons/react";
import { useParams } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "./spinner";

type WindowEvent = {
	scroll: boolean;
	resize: boolean;
};

export const Column = memo(function Column({ column }: { column: LumeColumn }) {
	const params = useParams({ strict: false });
	const container = useRef<HTMLDivElement>(null);
	const webviewLabel = `column-${params.account}_${column.label}`;

	const [isCreated, setIsCreated] = useState(false);

	const repositionWebview = useCallback(async () => {
		if (!container.current) return;

		const newRect = container.current.getBoundingClientRect();
		await invoke("reposition_column", {
			label: webviewLabel,
			x: newRect.x,
			y: newRect.y,
		});
	}, []);

	const resizeWebview = useCallback(async () => {
		if (!container.current) return;

		const newRect = container.current.getBoundingClientRect();
		await invoke("resize_column", {
			label: webviewLabel,
			width: newRect.width,
			height: newRect.height,
		});
	}, []);

	useEffect(() => {
		if (!isCreated) return;

		const unlisten = listen<WindowEvent>("child_webview", (data) => {
			if (data.payload.scroll) repositionWebview();
			if (data.payload.resize) repositionWebview().then(() => resizeWebview());
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, [isCreated]);

	useEffect(() => {
		if (!container.current) return;

		const rect = container.current.getBoundingClientRect();
		const url = `${column.url}?account=${params.account}&label=${column.label}&name=${column.name}`;

		const prop = {
			label: webviewLabel,
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
			url,
		};

		// create new webview
		invoke("create_column", { column: prop }).then(() => {
			console.log("created: ", webviewLabel);
			setIsCreated(true);
		});

		// close webview when unmounted
		return () => {
			invoke("close_column", { label: webviewLabel }).then(() => {
				console.log("closed: ", webviewLabel);
			});
		};
	}, [params.account]);

	return (
		<div className="h-full w-[440px] shrink-0 border-r border-black/5 dark:border-white/5">
			<div className="flex flex-col gap-px size-full">
				<Header label={column.label} />
				<div ref={container} className="flex-1 size-full">
					{!isCreated ? (
						<div className="size-full flex items-center justify-center">
							<Spinner />
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
});

function Header({ label }: { label: string }) {
	const [title, setTitle] = useState("");
	const [isChanged, setIsChanged] = useState(false);

	const column = useStore(appColumns, (state) =>
		state.find((col) => col.label === label),
	);

	const saveNewTitle = async () => {
		const mainWindow = getCurrentWindow();
		await mainWindow.emit("columns", { type: "set_title", label, title });

		// update search params
		// @ts-ignore, hahaha
		search.name = title;

		// reset state
		setIsChanged(false);
	};

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const window = getCurrentWindow();
		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Reload",
				action: async () => {
					await commands.reloadColumn(label);
				},
			}),
			MenuItem.new({
				text: "Open in new window",
				action: () => console.log("not implemented."),
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: "Move left",
				action: async () => {
					await window.emit("columns", {
						type: "move",
						label,
						direction: "left",
					});
				},
			}),
			MenuItem.new({
				text: "Move right",
				action: async () => {
					await window.emit("columns", {
						type: "move",
						label,
						direction: "right",
					});
				},
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: "Close",
				action: async () => {
					await window.emit("columns", {
						type: "remove",
						label,
					});
				},
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	useEffect(() => {
		if (title.length > 0) setIsChanged(true);
	}, [title.length]);

	return (
		<div className="group flex items-center justify-center gap-2 w-full h-9 shrink-0">
			<div className="flex items-center justify-center shrink-0 h-7">
				<div className="relative flex items-center gap-2">
					<div
						contentEditable
						suppressContentEditableWarning={true}
						onBlur={(e) => setTitle(e.currentTarget.textContent)}
						className="text-[12px] font-semibold focus:outline-none"
					>
						{column.name}
					</div>
					{isChanged ? (
						<button
							type="button"
							onClick={() => saveNewTitle()}
							className="text-teal-500 hover:text-teal-600 inline-flex items-center justify-center size-6 border-[.5px] border-neutral-200 dark:border-neutral-800 shadow shadow-neutral-200/50 dark:shadow-none rounded-full bg-white dark:bg-black"
						>
							<Check className="size-3" weight="bold" />
						</button>
					) : null}
				</div>
			</div>
			<button
				type="button"
				onClick={(e) => showContextMenu(e)}
				className="hidden shrink-0 group-hover:inline-flex items-center justify-center size-6 border-[.5px] border-neutral-200 dark:border-neutral-800 shadow shadow-neutral-200/50 dark:shadow-none rounded-full bg-white dark:bg-black"
			>
				<CaretDown className="size-3" weight="bold" />
			</button>
		</div>
	);
}
