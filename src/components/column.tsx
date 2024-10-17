import { commands } from "@/commands.gen";
import { appColumns } from "@/commons";
import { useRect } from "@/system";
import type { LumeColumn } from "@/types";
import { CaretDown, Check } from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-store";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useMemo, useState } from "react";

export function Column({ column }: { column: LumeColumn }) {
	const webviewLabel = useMemo(() => `column-${column.label}`, [column.label]);

	const [rect, ref] = useRect();
	const [_error, setError] = useState<string>(null);

	useEffect(() => {
		(async () => {
			if (rect) {
				const res = await commands.updateColumn(
					webviewLabel,
					rect.width,
					rect.height,
					rect.x,
					rect.y,
				);

				if (res.status === "ok") {
					console.log("webview is updated: ", webviewLabel);
				} else {
					console.log("webview error: ", res.error);
				}
			}
		})();
	}, [rect]);

	useEffect(() => {
		const isCreated = window.sessionStorage.getItem(webviewLabel);

		if (!isCreated) {
			const initialRect = ref.current.getBoundingClientRect();

			commands
				.createColumn({
					label: webviewLabel,
					x: initialRect.x,
					y: initialRect.y,
					width: initialRect.width,
					height: initialRect.height,
					url: `${column.url}?label=${column.label}&name=${column.name}`,
				})
				.then((res) => {
					if (res.status === "ok") {
						console.log("webview is created: ", webviewLabel);
						window.sessionStorage.setItem(webviewLabel, "");
					} else {
						setError(res.error);
					}
				});

			return () => {
				commands.closeColumn(webviewLabel).then((res) => {
					if (res.status === "ok") {
						console.log("webview is closed: ", webviewLabel);
					} else {
						console.log("webview error: ", res.error);
					}
				});
			};
		}
	}, []);

	return (
		<div className="h-full w-[440px] shrink-0 border-r border-black/5 dark:border-white/5">
			<div className="flex flex-col gap-px size-full">
				<Header label={column.label} />
				<div ref={ref} className="flex-1 size-full" />
			</div>
		</div>
	);
}

function Header({ label }: { label: string }) {
	const [title, setTitle] = useState("");
	const [isChanged, setIsChanged] = useState(false);

	const column = useStore(appColumns, (state) =>
		state.find((col) => col.label === label),
	);

	const saveNewTitle = async () => {
		await getCurrentWindow().emit("columns", {
			type: "set_title",
			label,
			title,
		});
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
