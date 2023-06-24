import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

export function User({ pubkey }: { pubkey: string }) {
	const { status, user } = useProfile(pubkey);

	return (
		<div className="flex items-center gap-2">
			{status === "loading" ? (
				<>
					<div className="relative h-11 w-11 shrink-0 rounded-md bg-zinc-800 animate-pulse" />
					<div className="flex w-full flex-1 flex-col items-start gap-1 text-start">
						<span className="w-1/2 h-4 rounded bg-zinc-800 animate-pulse" />
						<span className="w-1/3 h-3 rounded bg-zinc-800 animate-pulse" />
					</div>
				</>
			) : (
				<>
					<div className="relative h-11 w-11 shrink rounded-md">
						<Image
							src={user.image}
							fallback={DEFAULT_AVATAR}
							alt={pubkey}
							className="h-11 w-11 rounded-md object-cover"
							decoding="async"
						/>
					</div>
					<div className="flex w-full flex-1 flex-col items-start text-start">
						<span className="truncate font-medium leading-tight text-zinc-100">
							{user.displayName || user.name}
						</span>
						<span className="text-base leading-tight text-zinc-400">
							{user.nip05?.toLowerCase() || shortenKey(pubkey)}
						</span>
					</div>
				</>
			)}
		</div>
	);
}
