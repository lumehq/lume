import { commands } from "@/commands.gen";
import { cn, isValidRelayUrl, toLumeEvents } from "@/commons";
import { Spinner, User } from "@/components";
import { LumeWindow } from "@/system";
import type { LumeColumn, NostrEvent } from "@/types";
import { ArrowClockwise, ArrowRight, Plus } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { message } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { nanoid } from "nanoid";
import { memo, useCallback, useState, useTransition } from "react";
import { minidenticon } from "minidenticons";

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
				<Relayfeeds />
				<Interests />
				<ContentDiscovery />
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
		queryKey: ["newsfeeds", id],
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
			const users = item.tags.filter((tag) => tag[0] === "p");
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
						<div className="p-3 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
							<div className="flex flex-wrap items-center justify-center gap-2">
								{users.slice(0, 5).map((tag) => (
									<User.Provider key={tag[1]} pubkey={tag[1]}>
										<User.Root>
											<User.Avatar className="size-8 rounded-full" />
										</User.Root>
									</User.Provider>
								))}
								{users.length > 5 ? (
									<div className="size-8 rounded-full inline-flex items-center justify-center bg-neutral-300 dark:bg-neutral-700">
										<p className="truncate leading-tight text-[8px] font-medium">
											+{users.length - 5}
										</p>
									</div>
								) : null}
							</div>
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
										account: id,
										url:
											item.kind === 3
												? `/columns/newsfeed/${id}`
												: `/columns/groups/${item.id}`,
									})
								}
								className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
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
							name: "Browse Newsfeeds",
							url: "/columns/discover-newsfeeds",
							label: "discover_newsfeeds",
						})
					}
					className="h-9 w-full px-3 flex items-center justify-between bg-neutral-200/50 hover:bg-neutral-200 rounded-lg dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
				>
					<span className="text-xs font-medium">Browse newsfeeds</span>
					<ArrowRight className="size-4" weight="bold" />
				</button>
			</div>
		</div>
	);
}

function Relayfeeds() {
	const { id } = Route.useParams();
	const { isLoading, isError, error, data, refetch, isRefetching } = useQuery({
		queryKey: ["relays", id],
		queryFn: async () => {
			const res = await commands.getRelayList(id);

			if (res.status === "ok") {
				const event: NostrEvent = JSON.parse(res.data);
				return event;
			} else {
				throw new Error(res.error);
			}
		},
		refetchOnWindowFocus: false,
	});

	return (
		<div className="mb-12 flex flex-col gap-3">
			<div className="flex items-center justify-between px-2">
				<h3 className="font-semibold">Relayfeeds</h3>
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
				) : !data ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">You don't have any relay list yet.</p>
					</div>
				) : (
					<div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800">
						<div className="flex flex-col gap-2 p-2">
							{data?.tags.map((tag) =>
								tag[1]?.startsWith("wss://") ? (
									<div
										key={tag[1]}
										className="group px-3 flex items-center justify-between h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800"
									>
										<div className="flex-1 truncate select-text text-sm font-medium">
											{tag[1]}
										</div>
										<button
											type="button"
											onClick={() =>
												LumeWindow.openColumn({
													name: tag[1],
													label: `relays_${tag[1].replace(/[^\w\s]/gi, "")}`,
													url: `/columns/relays/${encodeURIComponent(tag[1])}`,
												})
											}
											className="h-6 w-16 hidden group-hover:inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
										>
											Add
										</button>
									</div>
								) : null,
							)}
						</div>
						<div className="p-2 flex items-center">
							<User.Provider pubkey={data?.pubkey}>
								<User.Root className="inline-flex items-center gap-2">
									<User.Avatar className="size-7 rounded-full" />
									<User.Name className="text-xs font-medium" />
								</User.Root>
							</User.Provider>
						</div>
					</div>
				)}
				<div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800">
					<RelayForm />
				</div>
				<button
					type="button"
					onClick={() =>
						LumeWindow.openColumn({
							name: "Browse Relays",
							url: "/columns/discover-relays",
							label: "discover_relays",
						})
					}
					className="h-9 w-full px-3 flex items-center justify-between bg-neutral-200/50 hover:bg-neutral-200 rounded-lg dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
				>
					<span className="text-xs font-medium">Browse relays</span>
					<ArrowRight className="size-4" weight="bold" />
				</button>
			</div>
		</div>
	);
}

function RelayForm() {
	const [url, setUrl] = useState("");
	const [isPending, startTransition] = useTransition();

	const submit = () => {
		startTransition(async () => {
			if (!isValidRelayUrl(url)) {
				await message("Relay URL is not valid", { kind: "error" });
				return;
			}

			await LumeWindow.openColumn({
				name: url,
				label: `relays_${url.replace(/[^\w\s]/gi, "")}`,
				url: `/columns/relays/${encodeURIComponent(url)}`,
			});

			setUrl("");
		});
	};

	return (
		<div className="flex flex-col gap-2 p-2">
			<label
				htmlFor="url"
				className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
			>
				Add custom relay
			</label>
			<div className="flex gap-2">
				<input
					name="url"
					type="url"
					onChange={(e) => setUrl(e.currentTarget.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") submit();
					}}
					value={url}
					disabled={isPending}
					placeholder="wss://..."
					spellCheck={false}
					className="flex-1 px-3 bg-neutral-100 border-transparent rounded-lg h-9 dark:bg-neutral-900 placeholder:text-neutral-600 focus:border-blue-500 focus:ring-0 dark:placeholder:text-neutral-400"
				/>
				<button
					type="button"
					disabled={isPending}
					onClick={() => submit()}
					className="shrink-0 h-9 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
				>
					Add
				</button>
			</div>
		</div>
	);
}

function Interests() {
	const { id } = Route.useParams();
	const { isLoading, isError, error, data, refetch, isRefetching } = useQuery({
		queryKey: ["interests", id],
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
							className="h-6 w-16 inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white"
						>
							Add
						</button>
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
							name: "Browse Interests",
							url: "/columns/discover-interests",
							label: "discover_interests",
						})
					}
					className="h-9 w-full px-3 flex items-center justify-between bg-neutral-200/50 hover:bg-neutral-200 rounded-lg dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
				>
					<span className="text-xs font-medium">Browse interests</span>
					<ArrowRight className="size-4" weight="bold" />
				</button>
			</div>
		</div>
	);
}

function ContentDiscovery() {
	const { isLoading, isError, error, data } = useQuery({
		queryKey: ["content-discovery"],
		queryFn: async () => {
			const res = await commands.getAllProviders();

			if (res.status === "ok") {
				const events: NostrEvent[] = res.data.map((item) => JSON.parse(item));
				return events;
			} else {
				throw new Error(res.error);
			}
		},
		refetchOnWindowFocus: false,
	});

	return (
		<div className="mb-12 flex flex-col gap-3">
			<div className="flex items-center justify-between px-2">
				<h3 className="font-semibold">Content Discovery</h3>
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
				) : !data ? (
					<div className="flex flex-col items-center justify-center h-16 w-full rounded-xl overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50">
						<p className="text-center">Empty.</p>
					</div>
				) : (
					<div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-neutral-800/50 shadow-lg shadow-primary dark:ring-1 dark:ring-neutral-800">
						<div className="flex flex-col gap-2 p-2">
							{data?.map((item) => (
								<Provider key={item.id} event={item} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

const Provider = memo(function Provider({ event }: { event: NostrEvent }) {
	const { id } = Route.useParams();
	const [isPending, startTransition] = useTransition();

	const metadata: { [key: string]: string } = JSON.parse(event.content);
	const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(
		minidenticon(event.id, 60, 50),
	)}`;

	const request = (name: string | undefined, provider: string) => {
		startTransition(async () => {
			// Ensure signer
			const signer = await commands.hasSigner(id);

			if (signer.status === "ok") {
				if (!signer.data) {
					const res = await commands.setSigner(id);

					if (res.status === "error") {
						await message(res.error, { kind: "error" });
						return;
					}
				}

				// Send request event to provider
				const res = await commands.requestEventsFromProvider(provider);

				if (res.status === "ok") {
					// Open column
					await LumeWindow.openColumn({
						label: `dvm_${provider.slice(0, 6)}`,
						name: name || "Content Discovery",
						account: id,
						url: `/columns/dvm/${provider}`,
					});
					return;
				} else {
					await message(res.error, { kind: "error" });
					return;
				}
			} else {
				await message(signer.error, { kind: "error" });
				return;
			}
		});
	};

	return (
		<div className="group px-3 flex gap-2 items-center justify-between h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800">
			<div className="shrink-0 size-10 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
				<img
					src={metadata.picture || fallback}
					alt={event.id}
					className="size-10 object-cover"
				/>
			</div>
			<div className="flex-1 flex flex-col truncate">
				<h5 className="text-sm font-medium">{metadata.name}</h5>
				<p className="w-full text-sm truncate text-neutral-600 dark:text-neutral-400">
					{metadata.about}
				</p>
			</div>
			<button
				type="button"
				onClick={() => request(metadata.name, event.pubkey)}
				disabled={isPending}
				className={cn(
					"h-6 w-16 group-hover:visible inline-flex items-center justify-center gap-1 text-xs font-semibold rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 hover:text-white",
					isPending ? "" : "invisible",
				)}
			>
				{isPending ? <Spinner className="size-3" /> : "Add"}
			</button>
		</div>
	);
});

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
