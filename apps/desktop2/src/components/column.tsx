import { CancelIcon, CheckIcon } from "@lume/icons";
import type { LumeColumn } from "@lume/types";
import { cn } from "@lume/utils";
import { invoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { useEffect, useMemo, useRef, useState } from "react";

export function Column({
	column,
	account,
	isScroll,
	isResize,
}: {
	column: LumeColumn;
	account: string;
	isScroll: boolean;
	isResize: boolean;
}) {
	const container = useRef<HTMLDivElement>(null);
	const webviewLabel = useMemo(
		() => `column-${account}_${column.label}`,
		[account],
	);

	const [isCreated, setIsCreated] = useState(false);

	const repositionWebview = async () => {
		const newRect = container.current.getBoundingClientRect();
		await invoke("reposition_column", {
			label: webviewLabel,
			x: newRect.x,
			y: newRect.y,
		});
	};

	const resizeWebview = async () => {
		const newRect = container.current.getBoundingClientRect();
		await invoke("resize_column", {
			label: webviewLabel,
			width: newRect.width,
			height: newRect.height,
		});
	};

	useEffect(() => {
		if (isCreated) resizeWebview();
	}, [isResize]);

	useEffect(() => {
		if (isScroll && isCreated) repositionWebview();
	}, [isScroll]);

	useEffect(() => {
		if (!container?.current) return;

		const rect = container.current.getBoundingClientRect();
		const url = `${column.content}?account=${account}&label=${column.label}&name=${column.name}`;

		// create new webview
		invoke("create_column", {
			label: webviewLabel,
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
			url,
		}).then(() => {
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
			<div
				className={cn(
					"flex flex-col w-full h-full rounded-xl",
					column.label !== "open"
						? "bg-black/5 dark:bg-white/5 backdrop-blur-sm"
						: "",
				)}
			>
				{column.label !== "open" ? (
					<Header label={column.label} name={column.name} />
				) : null}
				<div ref={container} className="flex-1 w-full h-full" />
			</div>
		</div>
	);
}

function Header({ label, name }: { label: string; name: string }) {
	const [title, setTitle] = useState(name);
	const [isChanged, setIsChanged] = useState(false);

	const saveNewTitle = async () => {
		const mainWindow = getCurrent();
		await mainWindow.emit("columns", { type: "set_title", label, title });

		// update search params
		// @ts-ignore, hahaha
		search.name = title;

		// reset state
		setIsChanged(false);
	};

	const close = async () => {
		const mainWindow = getCurrent();
		await mainWindow.emit("columns", { type: "remove", label });
	};

	useEffect(() => {
		if (title.length !== name.length) setIsChanged(true);
	}, [title]);

	return (
		<div className="h-9 w-full flex items-center justify-between shrink-0 px-1">
			<div className="size-7" />
			<div className="shrink-0 h-9 flex items-center justify-center">
				<div className="relative flex gap-2 items-center">
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
							<CheckIcon className="size-4" />
						</button>
					) : null}
				</div>
			</div>
			<button
				type="button"
				onClick={() => close()}
				className="size-7 inline-flex hover:bg-black/10 rounded-lg dark:hover:bg-white/10 items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
			>
				<CancelIcon className="size-4" />
			</button>
		</div>
	);
}
