import { useRelaylist } from "@lume/ark";
import { PlusIcon, ShareIcon } from "@lume/icons";
import { normalizeRelayUrl } from "nostr-fetch";
import { Link } from "react-router-dom";

export function RelayItem({ url }: { url: string }) {
	const domain = new URL(url).hostname;
	const { connectRelay } = useRelaylist();

	return (
		<div className="flex h-14 w-full items-center justify-between border-b border-neutral-100 px-5 dark:border-neutral-950">
			<div className="inline-flex items-center gap-2">
				<span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
					Relay:{" "}
				</span>
				<span className="max-w-[200px] truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
					{url}
				</span>
			</div>
			<div className="inline-flex items-center gap-2">
				<Link
					to={`/relays/${domain}/`}
					className="inline-flex h-6 items-center justify-center gap-1 rounded bg-neutral-100 px-1.5 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
				>
					<ShareIcon className="h-3 w-3" />
					Inspect
				</Link>
				<button
					type="button"
					onClick={() => connectRelay.mutate(normalizeRelayUrl(url))}
					className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900 hover:dark:bg-blue-800"
				>
					<PlusIcon className="size-4" />
				</button>
			</div>
		</div>
	);
}
