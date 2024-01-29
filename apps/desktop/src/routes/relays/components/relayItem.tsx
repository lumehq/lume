import { User, useRelaylist } from "@lume/ark";
import { PlusIcon, SearchIcon } from "@lume/icons";
import { normalizeRelayUrl } from "nostr-fetch";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function RelayItem({ url, users }: { url: string; users?: string[] }) {
	const domain = new URL(url).hostname;

	const { t } = useTranslation();
	const { connectRelay } = useRelaylist();

	return (
		<div className="flex h-14 w-full items-center justify-between border-b border-neutral-100 px-5 dark:border-neutral-950">
			<div className="inline-flex items-center gap-2">
				<span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
					{t("global.relay")}:{" "}
				</span>
				<span className="max-w-[200px] truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
					{url}
				</span>
			</div>
			<div className="inline-flex items-center gap-2">
				{users ? (
					<div className="isolate flex -space-x-2 mr-4">
						{users.slice(0, 4).map((item) => (
							<User.Provider pubkey={item}>
								<User.Root>
									<User.Avatar className="size-8 inline-block rounded-full ring-1 ring-neutral-100 dark:ring-neutral-900" />
								</User.Root>
							</User.Provider>
						))}
						{users.length > 4 ? (
							<div className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800">
								<span className="text-xs font-medium">+{users.length - 4}</span>
							</div>
						) : null}
					</div>
				) : null}
				<Link
					to={`/relays/${domain}/`}
					className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-neutral-100 px-2 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
				>
					<SearchIcon className="size-4" />
					{t("global.inspect")}
				</Link>
				<button
					type="button"
					onClick={() => connectRelay.mutate(normalizeRelayUrl(url))}
					className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900 hover:dark:bg-blue-800"
				>
					<PlusIcon className="size-5" />
				</button>
			</div>
		</div>
	);
}
