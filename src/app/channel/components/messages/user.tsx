import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function ChannelMessageUser({
	pubkey,
	time,
}: { pubkey: string; time: number }) {
	const { user, isError, isLoading } = useProfile(pubkey);

	return (
		<div className="group flex items-start gap-3">
			{isError || isLoading ? (
				<>
					<div className="relative h-11 w-11 shrink animate-pulse rounded-md bg-zinc-800" />
					<div className="flex w-full flex-1 items-start justify-between">
						<div className="flex items-baseline gap-2 text-base">
							<div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
						</div>
					</div>
				</>
			) : (
				<>
					<div className="relative h-11 w-11 shrink rounded-md">
						<Image
							src={user?.picture || DEFAULT_AVATAR}
							alt={pubkey}
							className="h-11 w-11 rounded-md object-cover"
						/>
					</div>
					<div className="flex w-full flex-1 items-start justify-between">
						<div className="flex items-baseline gap-2 text-base">
							<span className="font-semibold leading-none text-white group-hover:underline">
								{user?.nip05 || user?.name || shortenKey(pubkey)}
							</span>
							<span className="leading-none text-zinc-500">·</span>
							<span className="leading-none text-zinc-500">
								{dayjs().to(dayjs.unix(time))}
							</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
