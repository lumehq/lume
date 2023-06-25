import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export function ChatsListItem({ data }: { data: any }) {
	const { status, user, isFetching } = useProfile(data.sender_pubkey);

	return (
		<>
			{status === "loading" && isFetching ? (
				<div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
					<div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
					<div>
						<div className="h-2.5 w-full animate-pulse truncate rounded bg-zinc-800 text-base font-medium" />
					</div>
				</div>
			) : (
				<NavLink
					to={`/app/chat/${data.sender_pubkey}`}
					preventScrollReset={true}
					className={({ isActive }) =>
						twMerge(
							"inline-flex h-9 items-center gap-2.5 rounded-md px-2.5",
							isActive ? "bg-zinc-900/50 text-zinc-100" : "",
						)
					}
				>
					<div className="inline-flex shrink-0 h-6 w-6 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
						<Image
							src={user?.image}
							fallback={DEFAULT_AVATAR}
							alt={data.sender_pubkey}
							className="h-6 w-6 rounded object-cover"
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
				</NavLink>
			)}
		</>
	);
}
