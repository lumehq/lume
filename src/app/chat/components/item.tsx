import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { usePageContext } from "@utils/hooks/usePageContext";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import { twMerge } from "tailwind-merge";

export function ChatsListItem({ data }: { data: any }) {
	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;
	const pagePubkey = searchParams.pubkey;

	const { user, isError, isLoading } = useProfile(data.sender_pubkey);

	return (
		<>
			{isError && <div>error</div>}
			{isLoading && !user ? (
				<div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
					<div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800" />
					<div>
						<div className="h-2.5 w-full animate-pulse truncate rounded bg-zinc-800 text-base font-medium" />
					</div>
				</div>
			) : (
				<a
					href={`/app/chat?pubkey=${data.sender_pubkey}`}
					className={twMerge(
						"inline-flex h-9 items-center gap-2.5 rounded-md px-2.5",
						pagePubkey === data.sender_pubkey ? "bg-zinc-900 text-white" : "",
					)}
				>
					<div className="relative h-5 w-5 shrink-0 rounded">
						<Image
							src={user?.image || DEFAULT_AVATAR}
							alt={data.sender_pubkey}
							className="h-5 w-5 rounded bg-white object-cover"
						/>
					</div>
					<div className="w-full inline-flex items-center justify-between">
						<div className="inline-flex items-baseline gap-1">
							<h5 className="max-w-[9rem] truncate font-medium text-zinc-200">
								{user?.nip05 ||
									user?.displayName ||
									shortenKey(data.sender_pubkey)}
							</h5>
						</div>
						<div className="flex items-center">
							{data.new_messages && (
								<span className="inline-flex items-center justify-center rounded bg-fuchsia-400/10 w-8 px-1 py-1 text-xs font-medium text-fuchsia-500 ring-1 ring-inset ring-fuchsia-400/20">
									{data.new_messages}
								</span>
							)}
						</div>
					</div>
				</a>
			)}
		</>
	);
}
