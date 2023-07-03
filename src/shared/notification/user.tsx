import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

export function NotificationUser({
	pubkey,
	desc,
}: { pubkey: string; desc: string }) {
	const { status, user } = useProfile(pubkey);

	if (status === "loading") {
		return (
			<div className="flex items-center gap-2">
				<div className="relative h-11 w-11 shrink-0 rounded-md bg-zinc-800 animate-pulse" />
				<div className="flex w-full flex-1 flex-col items-start gap-1 text-start">
					<span className="w-1/2 h-4 rounded bg-zinc-800 animate-pulse" />
					<span className="w-1/3 h-3 rounded bg-zinc-800 animate-pulse" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-start gap-2">
			<div className="relative h-11 w-11 shrink rounded-md">
				<Image
					src={user.image}
					fallback={DEFAULT_AVATAR}
					alt={pubkey}
					className="h-11 w-11 rounded-md object-cover"
				/>
			</div>
			<div className="flex-1 inline-flex items-center justify-start text-start gap-1">
				<span className="leading-none text-zinc-400">
					{user.nip05 || user.name || user.displayName || shortenKey(pubkey)}
				</span>
				<span className="leading-none text-zinc-400">{desc}</span>
			</div>
		</div>
	);
}
