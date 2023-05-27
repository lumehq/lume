import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

export function ChatSidebar({ pubkey }: { pubkey: string }) {
	const { user, isError, isLoading } = useProfile(pubkey);

	return (
		<div className="px-3 py-2">
			<div className="flex flex-col gap-3">
				<div className="relative h-11 w-11 shrink rounded-md">
					<Image
						src={user?.picture || DEFAULT_AVATAR}
						alt={pubkey}
						className="h-11 w-11 rounded-md object-cover"
					/>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<h3 className="leading-none text-lg font-semibold">
							{user?.display_name || user?.name}
						</h3>
						<h5 className="leading-none text-zinc-400">
							{user?.nip05 || user?.username || shortenKey(pubkey)}
						</h5>
					</div>
					<div>
						<p className="leading-tight">{user?.bio || user?.about}</p>
						<a
							href={`/app/user?npub=${user.npub}`}
							className="mt-3 inline-flex w-full h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-zinc-800 text-sm text-zinc-300 hover:text-zinc-100 font-medium"
						>
							View full profile
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
