import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import dayjs from "dayjs";

export function ThreadAuthor({
	pubkey,
	time,
}: { pubkey: string; time: number }) {
	const { user } = useProfile(pubkey);

	return (
		<div className="relative flex items-center gap-2.5">
			<div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-zinc-900">
				<Image
					src={user?.picture || DEFAULT_AVATAR}
					alt={pubkey}
					className="h-9 w-9 object-cover"
				/>
			</div>
			<div className="flex w-full flex-1 items-start justify-between">
				<div className="flex flex-col gap-0.5">
					<h5 className="text-base font-semibold leading-none">
						{user?.display_name || user?.name || (
							<div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700" />
						)}
					</h5>
					<div className="flex items-baseline gap-1.5 text-base leading-none text-zinc-500">
						<span>{user?.nip05 || shortenKey(pubkey)}</span>
						<span>•</span>
						<span>{dayjs().to(dayjs.unix(time), true)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}