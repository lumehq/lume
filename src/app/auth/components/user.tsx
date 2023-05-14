import { Image } from "@shared/image";

import { DEFAULT_AVATAR } from "@stores/constants";

import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

export default function User({ pubkey }: { pubkey: string }) {
	const { user } = useProfile(pubkey);

	return (
		<div className="flex items-center gap-2">
			<div className="relative h-11 w-11 shrink rounded-md">
				<Image
					src={user?.picture || DEFAULT_AVATAR}
					alt={pubkey}
					className="h-11 w-11 rounded-md object-cover"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div className="flex w-full flex-1 flex-col items-start text-start">
				<span className="truncate font-medium leading-tight text-zinc-200">
					{user?.display_name || user?.name}
				</span>
				<span className="text-sm leading-tight text-zinc-400">
					{user?.nip05?.toLowerCase() || shortenKey(pubkey)}
				</span>
			</div>
		</div>
	);
}
