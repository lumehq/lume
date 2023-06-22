import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";

export function ChannelMessageUserMute({
	pubkey,
}: {
	pubkey: string;
}) {
	const { user, isError, isLoading } = useProfile(pubkey);

	return (
		<div className="flex items-center gap-3">
			{isError || isLoading ? (
				<>
					<div className="relative h-11 w-11 shrink animate-pulse rounded-md bg-zinc-800" />
					<div className="flex w-full flex-1 items-center justify-between">
						<div className="flex items-baseline gap-2 text-base">
							<div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
						</div>
					</div>
				</>
			) : (
				<>
					<div className="relative h-11 w-11 shrink-0 rounded-md">
						<Image
							src={user?.image}
							fallback={DEFAULT_AVATAR}
							alt={pubkey}
							className="h-11 w-11 rounded-md object-cover"
						/>
					</div>
					<div className="flex w-full flex-1 items-center justify-between">
						<span className="leading-none text-zinc-300">
							You has been muted this user
						</span>
					</div>
				</>
			)}
		</div>
	);
}
