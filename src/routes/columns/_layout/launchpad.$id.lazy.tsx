import { commands } from "@/commands.gen";
import { cn, toLumeEvents } from "@/commons";
import { Spinner, User } from "@/components";
import { LumeWindow } from "@/system";
import type { LumeColumn, NostrEvent } from "@/types";
import { ArrowClockwise, ArrowRight, Plus } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";
import { useCallback } from "react";

export const Route = createLazyFileRoute("/columns/_layout/launchpad/$id")({
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
				<Newsfeeds />
				<Interests />
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

function Newsfeeds() {
	const { id } = Route.useParams();
	const { isLoading, isError, error, data, refetch, isRefetching } = useQuery({
		queryKey: ["others", "newsfeeds", id],
		queryFn: async () => {
			const res = await commands.getAllNewsfeeds(id);

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
				item.kind === 3
					? "Contacts"
					: item.tags.find((tag) => tag[0] === "title")?.[1] || "Unnamed";

			const label =
				item.kind === 3
					? `newsfeed-${id.slice(0, 5)}`
					: item.tags.find((tag) => tag[0] === "d")?.[1] || nanoid();

			return (
				<div
					key={item.id}
					className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800"
				>
					<div className="px-2 pt-2">
						<ScrollArea.Root
							type={"scroll"}
							scrollHideDelay={300}
							className="overflow-hidden size-full"
						>
							<ScrollArea.Viewport className="p-3 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
								<div className="flex flex-wrap items-center justify-center gap-2">
									{item.tags
										.filter((tag) => tag[0] === "p")
										.map((tag) => (
											<User.Provider key={tag[1]} pubkey={tag[1]}>
												<User.Root>
													<User.Avatar className="size-8 rounded-full" />
												</User.Root>
											</User.Provider>
										))}
								</div>
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar
								className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
								orientation="vertical"
							>
								<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
							</ScrollArea.Scrollbar>
							<ScrollArea.Corner className="bg-transparent" />
						</ScrollArea.Root>
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
										account: id,
										url:
											item.kind === 3
												? `/columns/newsfeed/${id}`
												: `/columns/groups/${item.id}`,
									})
								}
								className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-100 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 group-hover:text-white"
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
				<h3 className="font-semibold">Newsfeeds</h3>
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
						onClick={() => LumeWindow.openPopup(`${id}/set-group`, "New group")}
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
				) : isError ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">{error?.message ?? "Error"}</p>
					</div>
				) : !data?.length ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">You don't have any groups yet.</p>
					</div>
				) : (
					data?.map((item) => renderItem(item))
				)}
				<button
					type="button"
					onClick={() =>
						LumeWindow.openColumn({
							name: "Newsfeeds",
							url: "/columns/discover-newsfeeds",
							label: "discover_newsfeeds",
						})
					}
					className="h-12 px-3 flex items-center justify-between bg-neutral-200/50 rounded-xl text-blue-600 dark:text-blue-400"
				>
					<span className="text-sm font-medium">Discover newsfeeds</span>
					<ArrowRight className="size-4" weight="bold" />
				</button>
			</div>
		</div>
	);
}

function Interests() {
	const { id } = Route.useParams();
	const { isLoading, isError, error, data, refetch, isRefetching } = useQuery({
		queryKey: ["others", "interests", id],
		queryFn: async () => {
			const res = await commands.getAllInterests(id);

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
						<ScrollArea.Root
							type={"scroll"}
							scrollHideDelay={300}
							className="overflow-hidden size-full"
						>
							<ScrollArea.Viewport className="p-3 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
								<div className="flex flex-wrap items-center justify-center gap-2">
									{item.tags
										.filter((tag) => tag[0] === "t")
										.map((tag) => (
											<div key={tag[1]} className="text-sm font-medium">
												{tag[1].includes("#") ? tag[1] : `#${tag[1]}`}
											</div>
										))}
								</div>
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar
								className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
								orientation="vertical"
							>
								<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
							</ScrollArea.Scrollbar>
							<ScrollArea.Corner className="bg-transparent" />
						</ScrollArea.Root>
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
										account: id,
										url: `/columns/interests/${item.id}`,
									})
								}
								className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-100 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 group-hover:text-white"
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
							LumeWindow.openPopup(`${id}/set-interest`, "New interest")
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
				) : isError ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">{error?.message ?? "Error"}</p>
					</div>
				) : !data?.length ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">You don't have any interests yet.</p>
					</div>
				) : (
					data?.map((item) => renderItem(item))
				)}
				<button
					type="button"
					onClick={() =>
						LumeWindow.openColumn({
							name: "Interests",
							url: "/columns/discover-interests",
							label: "discover_interests",
						})
					}
					className="h-12 px-3 flex items-center justify-between bg-neutral-200/50 rounded-xl text-blue-600 dark:text-blue-400"
				>
					<span className="text-sm font-medium">Discover interests</span>
					<ArrowRight className="size-4" weight="bold" />
				</button>
			</div>
		</div>
	);
}

function Core() {
	const { id } = Route.useParams();
	const { data } = useQuery({
		queryKey: ["core-columns"],
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
			<div className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800">
				<div className="flex flex-col gap-2 p-2">
					<div className="px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800">
						<div className="text-sm font-medium">Stories</div>
						<button
							type="button"
							onClick={() => LumeWindow.openStory(id)}
							className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
						>
							Add
						</button>
					</div>
					<div className="px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800">
						<div className="text-sm font-medium">Notification</div>
						<button
							type="button"
							onClick={() => LumeWindow.openNotification(id)}
							className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
						>
							Add
						</button>
					</div>
					{data?.map((column) => (
						<div
							key={column.label}
							className="px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800"
						>
							<div className="text-sm font-medium">{column.name}</div>
							<button
								type="button"
								onClick={() => LumeWindow.openColumn(column)}
								className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
							>
								Add
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
