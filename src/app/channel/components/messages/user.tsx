import { Image } from "@shared/image";

import { DEFAULT_AVATAR, IMGPROXY_URL } from "@stores/constants";

import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ChannelMessageUser({
	pubkey,
	time,
}: { pubkey: string; time: number }) {
	const { user, isError, isLoading } = useProfile(pubkey);

	return (
		<div className="group flex items-start gap-3">
			{isError || isLoading ? (
				<>
					<div className="relative h-9 w-9 shrink animate-pulse rounded-md bg-zinc-800" />
					<div className="flex w-full flex-1 items-start justify-between">
						<div className="flex items-baseline gap-2 text-sm">
							<div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
						</div>
					</div>
				</>
			) : (
				<>
					<div className="relative h-9 w-9 shrink rounded-md">
						<Image
							src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${
								user?.picture ? user.picture : DEFAULT_AVATAR
							}`}
							alt={pubkey}
							className="h-9 w-9 rounded-md object-cover"
						/>
					</div>
					<div className="flex w-full flex-1 items-start justify-between">
						<div className="flex items-baseline gap-2 text-sm">
							<span className="font-semibold leading-none text-zinc-200 group-hover:underline">
								{user?.display_name || user?.name || shortenKey(pubkey)}
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
