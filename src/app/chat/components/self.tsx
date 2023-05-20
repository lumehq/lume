import { Image } from "@shared/image";

import { DEFAULT_AVATAR } from "@stores/constants";

import { useActiveAccount } from "@utils/hooks/useActiveAccount";
import { usePageContext } from "@utils/hooks/usePageContext";
import { shortenKey } from "@utils/shortenKey";

import { twMerge } from "tailwind-merge";

export default function ChatsListSelfItem() {
	const pageContext = usePageContext();

	const searchParams: any = pageContext.urlParsed.search;
	const pagePubkey = searchParams.pubkey;

	const { account, isLoading, isError } = useActiveAccount();
	const profile = account ? JSON.parse(account.metadata) : null;

	return (
		<>
			{isError && <div>error</div>}
			{isLoading && !account ? (
				<div className="inline-flex h-8 items-center gap-2.5 rounded-md px-2.5">
					<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
					<div>
						<div className="h-2.5 w-full animate-pulse truncate rounded bg-zinc-800 text-base font-medium" />
					</div>
				</div>
			) : (
				<a
					href={`/app/chat?pubkey=${account.pubkey}`}
					className={twMerge(
						"inline-flex h-8 items-center gap-2.5 rounded-md px-2.5 hover:bg-zinc-900",
						pagePubkey === account.pubkey
							? "dark:bg-zinc-900 dark:text-white hover:dark:bg-zinc-800"
							: "",
					)}
				>
					<div className="relative h-5 w-5 shrink-0 rounded">
						<Image
							src={profile?.picture || DEFAULT_AVATAR}
							alt={account.pubkey}
							className="h-5 w-5 rounded bg-white object-cover"
						/>
					</div>
					<div>
						<h5 className="truncate font-medium text-zinc-400">
							{profile?.nip05 || profile?.name || shortenKey(account.pubkey)}{" "}
							<span className="text-zinc-600">(you)</span>
						</h5>
					</div>
				</a>
			)}
		</>
	);
}
