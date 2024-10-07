import { commands } from "@/commands.gen";
import { Spinner, User } from "@/components";
import { LumeWindow } from "@/system";
import type { LumeColumn, NostrEvent } from "@/types";
import { ArrowClockwise, Plus } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { useCallback } from "react";

export const Route = createLazyFileRoute("/columns/_layout/gallery")({
	component: Screen,
});

function Screen() {
	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport className="relative h-full px-3 pb-3">
				<MyGroups />
				<MyInterests />
				<Core />
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
				orientation="vertical"
			>
				<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner className="bg-transparent" />
		</ScrollArea.Root>
	);
}

function Core() {
	const { isLoading, data } = useQuery({
		queryKey: ["core"],
		queryFn: async () => {
			const systemPath = "resources/columns.json";
			const resourcePath = await resolveResource(systemPath);
			const resourceFile = await readTextFile(resourcePath);

			const systemColumns: LumeColumn[] = JSON.parse(resourceFile);
			const columns = systemColumns.filter((col) => !col.default);

			return columns;
		},
		refetchOnWindowFocus: false,
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between px-2">
				<h3 className="font-semibold">Core</h3>
			</div>
			<div className="flex flex-col gap-3">
				{isLoading ? (
					<div className="inline-flex items-center gap-1.5">
						<Spinner className="size-4" />
						Loading...
					</div>
				) : (
					data.map((column) => (
						<div
							key={column.label}
							className="group flex px-4 items-center justify-between h-16 rounded-xl bg-white dark:bg-black border-[.5px] border-neutral-300 dark:border-neutral-700"
						>
							<div className="text-sm">
								<div className="mb-px leading-tight font-semibold">
									{column.name}
								</div>
								<div className="leading-tight text-neutral-500 dark:text-neutral-400">
									{column.description}
								</div>
							</div>
							<button
								type="button"
								onClick={() => LumeWindow.openColumn(column)}
								className="text-xs uppercase font-semibold w-16 h-7 hidden group-hover:inline-flex items-center justify-center rounded-full bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-black/10"
							>
								Open
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}

function MyGroups() {
	const { account } = Route.useSearch();
	const { isLoading, data, refetch } = useQuery({
		queryKey: ["mygroups", account],
		queryFn: async () => {
			const res = await commands.getAllGroups();

			if (res.status === "ok") {
				const data = res.data.map((item) => JSON.parse(item) as NostrEvent);
				return data;
			} else {
				throw new Error(res.error);
			}
		},
		select: (data) =>
			data.filter(
				(item) => item.tags.filter((tag) => tag[0] === "p")?.length > 0,
			),
		refetchOnWindowFocus: false,
	});

	const renderItem = useCallback(
		(item: NostrEvent) => {
			const name = item.tags.filter((tag) => tag[0] === "d")[0][1] ?? "unnamed";

			return (
				<div
					key={item.id}
					className="group flex flex-col rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50 border-[.5px] border-neutral-300 dark:border-neutral-700"
				>
					<div className="p-3 h-16 flex flex-wrap items-center justify-center gap-2 overflow-y-auto">
						{item.tags
							.filter((tag) => tag[0] === "p")
							.map((tag) => (
								<div key={tag[1]}>
									<User.Provider pubkey={tag[1]}>
										<User.Root>
											<User.Avatar className="size-8 rounded-full" />
										</User.Root>
									</User.Provider>
								</div>
							))}
					</div>
					<div className="p-3 flex items-center justify-between">
						<div className="text-sm font-medium">{name}</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() =>
									LumeWindow.openColumn({
										label: name,
										name,
										url: `/columns/groups/${item.id}`,
									})
								}
								className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-blue-600 hover:bg-blue-500 text-white"
							>
								Add
							</button>
						</div>
					</div>
				</div>
			);
		},
		[data],
	);

	return (
		<div className="mb-12 flex flex-col gap-3">
			<div className="flex items-center justify-between px-2">
				<h3 className="font-semibold">My groups</h3>
				<div className="inline-flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={() => refetch()}
						className="size-7 inline-flex items-center justify-center rounded-full"
					>
						<ArrowClockwise className="size-4" />
					</button>
					<button
						type="button"
						onClick={() =>
							LumeWindow.openPopup("New group", `/set-group?account=${account}`)
						}
						className="h-7 w-max px-2 inline-flex items-center justify-center gap-1 text-sm font-medium rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
					>
						<Plus className="size-3" weight="bold" />
						New
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-3">
				{isLoading ? (
					<div className="inline-flex items-center gap-1.5">
						<Spinner className="size-4" />
						Loading...
					</div>
				) : !data.length ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">You don't have any groups yet.</p>
					</div>
				) : (
					data.map((item) => renderItem(item))
				)}
			</div>
		</div>
	);
}

function MyInterests() {
	const { account } = Route.useSearch();
	const { isLoading, data, refetch } = useQuery({
		queryKey: ["myinterests", account],
		queryFn: async () => {
			const res = await commands.getAllInterests();

			if (res.status === "ok") {
				const data = res.data.map((item) => JSON.parse(item) as NostrEvent);
				return data;
			} else {
				throw new Error(res.error);
			}
		},
		select: (data) =>
			data.filter(
				(item) => item.tags.filter((tag) => tag[0] === "t")?.length > 0,
			),
		refetchOnWindowFocus: false,
	});

	const renderItem = useCallback(
		(item: NostrEvent) => {
			const name = item.tags.filter((tag) => tag[0] === "d")[0][1] ?? "unnamed";

			return (
				<div
					key={item.id}
					className="group flex flex-col rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50 border-[.5px] border-neutral-300 dark:border-neutral-700"
				>
					<div className="p-3 h-16 flex flex-wrap items-center justify-center gap-2 overflow-y-auto">
						{item.tags
							.filter((tag) => tag[0] === "t")
							.map((tag) => (
								<div key={tag[1]} className="text-sm font-medium">
									{tag[1]}
								</div>
							))}
					</div>
					<div className="p-3 flex items-center justify-between">
						<div className="text-sm font-medium">{name}</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() =>
									LumeWindow.openColumn({
										label: name,
										name,
										url: `/columns/interests/${item.id}`,
									})
								}
								className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-blue-600 hover:bg-blue-500 text-white"
							>
								Add
							</button>
						</div>
					</div>
				</div>
			);
		},
		[data],
	);

	return (
		<div className="mb-12 flex flex-col gap-3">
			<div className="flex items-center justify-between px-2">
				<h3 className="font-semibold">My interests</h3>
				<div className="inline-flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={() => refetch()}
						className="size-7 inline-flex items-center justify-center rounded-full"
					>
						<ArrowClockwise className="size-4" />
					</button>
					<button
						type="button"
						onClick={() =>
							LumeWindow.openPopup(
								"New interest",
								`/set-interest?account=${account}`,
							)
						}
						className="h-7 w-max px-2 inline-flex items-center justify-center gap-1 text-sm font-medium rounded-full bg-neutral-300 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
					>
						<Plus className="size-3" weight="bold" />
						New
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-3">
				{isLoading ? (
					<div className="inline-flex items-center gap-1.5">
						<Spinner className="size-4" />
						Loading...
					</div>
				) : !data.length ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">You don't have any interests yet.</p>
					</div>
				) : (
					data.map((item) => renderItem(item))
				)}
			</div>
		</div>
	);
}
