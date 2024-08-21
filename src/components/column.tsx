import type { LumeColumn } from "@/types";
import { Check, DotsThree } from "@phosphor-icons/react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { memo, useCallback, useEffect, useRef, useState } from "react";

type WindowEvent = {
	scroll: boolean;
	resize: boolean;
};

export const Column = memo(function Column({
	column,
	account,
}: {
	column: LumeColumn;
	account: string;
}) {
	const container = useRef<HTMLDivElement>(null);
	const webviewLabel = `column-${account}_${column.label}`;

	const [isCreated, setIsCreated] = useState(false);

	const repositionWebview = useCallback(async () => {
		const newRect = container.current.getBoundingClientRect();
		await invoke("reposition_column", {
			label: webviewLabel,
			x: newRect.x,
			y: newRect.y,
		});
	}, []);

	const resizeWebview = useCallback(async () => {
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
		if (!container?.current) return;

		const rect = container.current.getBoundingClientRect();
		const url = `${column.url}?account=${account}&label=${column.label}&name=${column.name}`;

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
	}, [account]);

	return (
		<div className="h-full w-[440px] shrink-0 p-2">
			<div className="flex flex-col w-full h-full rounded-xl bg-black/5 dark:bg-white/10">
				<Header
					label={column.label}
					webview={webviewLabel}
					name={column.name}
				/>
				<div ref={container} className="flex-1 w-full h-full" />
			</div>
		</div>
	);
});

function Header({
	label,
	webview,
	name,
}: { label: string; webview: string; name: string }) {
	const [title, setTitle] = useState(name);
	const [isChanged, setIsChanged] = useState(false);

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

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Reload",
				action: async () => {
					await invoke("reload_column", { label: webview });
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
					await getCurrentWindow().emit("columns", {
						type: "move",
						label,
						direction: "left",
					});
				},
			}),
			MenuItem.new({
				text: "Move right",
				action: async () => {
					await getCurrentWindow().emit("columns", {
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
					await getCurrentWindow().emit("columns", {
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
		if (title.length !== name.length) setIsChanged(true);
	}, [title]);

	return (
		<div className="flex items-center justify-between w-full px-1 h-9 shrink-0">
			<div className="size-7" />
			<div className="flex items-center justify-center shrink-0 h-7">
				<div className="relative flex items-center gap-2">
					<div
						contentEditable
						suppressContentEditableWarning={true}
						onBlur={(e) => setTitle(e.currentTarget.textContent)}
						className="text-sm font-medium focus:outline-none"
					>
						{name}
					</div>
					{isChanged ? (
						<button
							type="button"
							onClick={() => saveNewTitle()}
							className="text-teal-500 hover:text-teal-600"
						>
							<Check className="size-4" />
						</button>
					) : null}
				</div>
			</div>
			<button
				type="button"
				onClick={(e) => showContextMenu(e)}
				className="inline-flex items-center justify-center rounded-lg size-7 hover:bg-black/10 dark:hover:bg-white/10"
			>
				<DotsThree className="size-5" />
			</button>
		</div>
	);
}
