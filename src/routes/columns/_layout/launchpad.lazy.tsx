import { commands } from "@/commands.gen";
import { cn, toLumeEvents } from "@/commons";
import { Spinner, User } from "@/components";
import { LumeWindow } from "@/system";
import type { LumeColumn, NostrEvent } from "@/types";
import { ArrowClockwise, Plus } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";
import { useCallback } from "react";

export const Route = createLazyFileRoute("/columns/_layout/launchpad")({
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
				<Groups />
				<Interests />
				<Accounts />
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

function Groups() {
	const { isLoading, data, refetch, isRefetching } = useQuery({
		queryKey: ["others", "groups"],
		queryFn: async () => {
			const res = await commands.getAllGroups();

			if (res.status === "ok") {
				const data = toLumeEvents(res.data);
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
			const name =
				item.tags.find((tag) => tag[0] === "title")?.[1] || "Unnamed";
			const label = item.tags.find((tag) => tag[0] === "d")?.[1] || nanoid();

			return (
				<div
					key={item.id}
					className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800"
				>
					<div className="px-2 pt-2">
						<div className="p-3 h-16 bg-neutral-100 rounded-lg flex flex-wrap items-center justify-center gap-2 overflow-y-auto">
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
					</div>
					<div className="p-2 flex items-center justify-between">
						<div className="inline-flex items-center gap-2">
							<User.Provider pubkey={item.pubkey}>
								<User.Root>
									<User.Avatar className="size-7 rounded-full" />
								</User.Root>
							</User.Provider>
							<h5 className="text-xs font-medium">{name}</h5>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() =>
									LumeWindow.openColumn({
										label,
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
				<h3 className="font-semibold">Groups</h3>
				<div className="inline-flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={() => refetch()}
						className={cn(
							"size-7 inline-flex items-center justify-center rounded-full",
							isRefetching ? "animate-spin" : "",
						)}
					>
						<ArrowClockwise className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => LumeWindow.openPopup("/set-group", "New group")}
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

function Interests() {
	const { isLoading, data, refetch, isRefetching } = useQuery({
		queryKey: ["others", "interests"],
		queryFn: async () => {
			const res = await commands.getAllInterests();

			if (res.status === "ok") {
				const data = toLumeEvents(res.data);
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
			const name =
				item.tags.find((tag) => tag[0] === "title")?.[1] || "Unnamed";
			const label =
				item.tags.find((tag) => tag[0] === "label")?.[1] || nanoid();

			return (
				<div
					key={item.id}
					className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800"
				>
					<div className="px-2 pt-2">
						<div className="p-3 h-16 bg-neutral-100 rounded-lg flex flex-wrap items-center justify-center gap-4 overflow-y-auto">
							{item.tags
								.filter((tag) => tag[0] === "t")
								.map((tag) => (
									<div key={tag[1]} className="text-sm font-medium">
										{tag[1]}
									</div>
								))}
						</div>
					</div>
					<div className="p-3 flex items-center justify-between">
						<div className="inline-flex items-center gap-2">
							<User.Provider pubkey={item.pubkey}>
								<User.Root>
									<User.Avatar className="size-7 rounded-full" />
								</User.Root>
							</User.Provider>
							<h5 className="text-xs font-medium">{name}</h5>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() =>
									LumeWindow.openColumn({
										label,
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
				<h3 className="font-semibold">Interests</h3>
				<div className="inline-flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={() => refetch()}
						className={cn(
							"size-7 inline-flex items-center justify-center rounded-full",
							isRefetching ? "animate-spin" : "",
						)}
					>
						<ArrowClockwise className="size-4" />
					</button>
					<button
						type="button"
						onClick={() =>
							LumeWindow.openPopup("/set-interest", "New interest")
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

function Accounts() {
	const { isLoading, data: accounts } = useQuery({
		queryKey: ["accounts"],
		queryFn: async () => {
			const res = await commands.getAccounts();
			return res;
		},
		refetchOnWindowFocus: false,
	});

	return (
		<div className="mb-12 flex flex-col gap-3">
			<div className="flex items-center justify-between px-2">
				<h3 className="font-semibold">Accounts</h3>
			</div>
			<div className="flex flex-col gap-3">
				{isLoading ? (
					<div className="inline-flex items-center gap-1.5 text-sm">
						<Spinner className="size-4" />
						Loading...
					</div>
				) : (
					accounts.map((account) => (
						<div
							key={account}
							className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800"
						>
							<div className="px-2 pt-2">
								<User.Provider pubkey={account}>
									<User.Root className="inline-flex items-center gap-2">
										<User.Avatar className="size-7 rounded-full" />
										<User.Name className="text-xs font-medium" />
									</User.Root>
								</User.Provider>
							</div>
							<div className="flex flex-col gap-2 p-2">
								<div className="px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800">
									<div className="text-sm font-medium">Newsfeed</div>
									<button
										type="button"
										onClick={() => LumeWindow.openNewsfeed(account)}
										className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
									>
										Add
									</button>
								</div>
								<div className="px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800">
									<div className="text-sm font-medium">Stories</div>
									<button
										type="button"
										onClick={() => LumeWindow.openStory(account)}
										className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
									>
										Add
									</button>
								</div>
								<div className="px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800">
									<div className="text-sm font-medium">Notification</div>
									<button
										type="button"
										onClick={() => LumeWindow.openNotification(account)}
										className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
									>
										Add
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

function Core() {
	const { isLoading, data } = useQuery({
		queryKey: ["other-columns"],
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
				<h3 className="font-semibold">Others</h3>
			</div>
			<div className="flex flex-col gap-3">
				{isLoading ? (
					<div className="inline-flex items-center gap-1.5 text-sm">
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
								className="text-xs font-semibold w-16 h-7 hidden group-hover:inline-flex items-center justify-center rounded-full bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-black/10"
							>
								Add
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
}
