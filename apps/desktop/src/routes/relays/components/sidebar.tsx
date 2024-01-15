import { useArk } from "@lume/ark";
import { CancelIcon, RefreshIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useQuery } from "@tanstack/react-query";
import { RelayForm } from "./relayForm";

export function RelaySidebar({ className }: { className?: string }) {
	const ark = useArk();

	const { status, data, refetch } = useQuery({
		queryKey: ["relay-personal"],
		queryFn: async () => {
			const event = await ark.getEventByFilter({
				filter: {
					kinds: [NDKKind.RelayList],
					authors: [ark.account.pubkey],
				},
			});

			if (!event) return [];
			return event.tags.filter((tag) => tag[0] === "r");
		},
		refetchOnWindowFocus: false,
	});

	const currentRelays = new Set(
		ark.ndk.pool.connectedRelays().map((item) => item.url),
	);

	return (
		<div
			className={cn(
				"rounded-l-xl bg-white/50 backdrop-blur-xl dark:bg-black/50",
				className,
			)}
		>
			<div className="inline-flex items-center justify-between w-full h-14 px-3 border-b border-black/10 dark:border-white/10">
				<h3 className="font-semibold">Connected relays</h3>
				<button
					type="button"
					onClick={() => refetch()}
					className="inline-flex items-center justify-center w-6 h-6 rounded-md shrink-0 hover:bg-neutral-100 dark:hover:bg-neutral-900"
				>
					<RefreshIcon className="w-4 h-4" />
				</button>
			</div>
			<div className="flex flex-col gap-2 px-3 mt-3">
				{status === "pending" ? (
					<p>Loading...</p>
				) : !data.length ? (
					<div className="flex items-center justify-center w-full h-20 rounded-xl bg-neutral-50 dark:bg-neutral-950">
						<p className="text-sm font-medium">
							You not have personal relay list yet
						</p>
					</div>
				) : (
					data.map((item) => (
						<div
							key={item[1]}
							className="flex items-center justify-between px-3 rounded-lg group h-11 bg-white/50 dark:bg-black/50"
						>
							<div className="inline-flex items-baseline gap-2">
								{currentRelays.has(item[1]) ? (
									<span className="relative flex w-2 h-2">
										<span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping" />
										<span className="relative inline-flex w-2 h-2 bg-teal-500 rounded-full" />
									</span>
								) : (
									<span className="relative flex w-2 h-2">
										<span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping" />
										<span className="relative inline-flex w-2 h-2 bg-red-500 rounded-full" />
									</span>
								)}
								<p className="max-w-[20rem] truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
									{item[1].replace("wss://", "").replace("ws://", "")}
								</p>
							</div>
							<div className="inline-flex items-center gap-2">
								{item[2]?.length ? (
									<div className="inline-flex items-center justify-center h-6 px-2 text-xs font-medium capitalize rounded w-max bg-neutral-200 dark:bg-neutral-800">
										{item[2]}
									</div>
								) : null}
								<button
									type="button"
									className="items-center justify-center hidden w-6 h-6 rounded group-hover:inline-flex hover:bg-neutral-300 dark:hover:bg-neutral-700"
								>
									<CancelIcon className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
								</button>
							</div>
						</div>
					))
				)}
				<RelayForm />
			</div>
		</div>
	);
}