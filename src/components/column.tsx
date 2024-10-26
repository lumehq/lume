import { commands } from "@/commands.gen";
import { useRect } from "@/system";
import type { LumeColumn } from "@/types";
import { CaretDown, Check } from "@phosphor-icons/react";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { User } from "./user";

export function Column({ column }: { column: LumeColumn }) {
	const [rect, ref] = useRect();
	const [_error, setError] = useState<string>("");

	useEffect(() => {
		(async () => {
			if (rect) {
				const res = await commands.updateColumn(
					column.label,
					rect.width,
					rect.height,
					rect.x,
					rect.y,
				);

				if (res.status === "ok") {
					console.log("webview is updated: ", column.label);
				} else {
					console.log("webview error: ", res.error);
				}
			}
		})();
	}, [rect]);

	useLayoutEffect(() => {
		console.log(column.label);
		if (ref.current) {
			const initialRect = ref.current.getBoundingClientRect();

			commands
				.createColumn({
					label: column.label,
					x: initialRect.x,
					y: initialRect.y,
					width: initialRect.width,
					height: initialRect.height,
					url: `${column.url}?label=${column.label}&name=${column.name}`,
				})
				.then((res) => {
					if (res.status === "ok") {
						console.log("webview is created: ", column.label);
					} else {
						setError(res.error);
					}
				});

			return () => {
				commands.closeColumn(column.label).then((res) => {
					if (res.status === "ok") {
						console.log("webview is closed: ", column.label);
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
				<Header
					label={column.label}
					name={column.name}
					account={column.account}
				/>
				<div ref={ref} className="flex-1 size-full" />
			</div>
		</div>
	);
}

function Header({
	label,
	name,
	account,
}: { label: string; name: string; account?: string }) {
	const [title, setTitle] = useState("");
	const [isChanged, setIsChanged] = useState(false);

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

	const saveNewTitle = async () => {
		await getCurrentWindow().emit("columns", {
			type: "set_title",
			label,
			title,
		});
		setIsChanged(false);
	};

	useEffect(() => {
		if (title.length > 0) setIsChanged(true);
	}, [title.length]);

	return (
		<div className="group flex items-center justify-center gap-2 w-full h-9 shrink-0">
			<div className="flex items-center justify-center shrink-0 h-7">
				<div className="relative flex items-center gap-2">
					{account?.length ? (
						<User.Provider pubkey={account}>
							<User.Root>
								<User.Avatar className="size-6 rounded-full" />
							</User.Root>
						</User.Provider>
					) : null}
					<div
						contentEditable
						suppressContentEditableWarning={true}
						onBlur={(e) => {
							if (e.currentTarget.textContent) {
								setTitle(e.currentTarget.textContent);
							}
						}}
						className="text-[12px] font-semibold focus:outline-none"
					>
						{name}
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
