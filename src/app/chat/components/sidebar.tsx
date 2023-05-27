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
				<div className="flex flex-col gap-1">
					<h3 className="leading-none text-lg font-semibold">
						{user?.display_name || user?.name}
					</h3>
					<p className="leading-none text-zinc-400">
						{user?.nip05 || user?.username || shortenKey(pubkey)}
					</p>
				</div>
			</div>
		</div>
	);
}
