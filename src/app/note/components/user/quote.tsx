import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function NoteQuoteUser({
	pubkey,
	time,
}: {
	pubkey: string;
	time: number;
}) {
	const { user } = useProfile(pubkey);

	return (
		<div className="group flex items-center gap-2">
			<div className="relative h-6 w-6 shrink-0 rounded">
				<Image
					src={user?.picture || DEFAULT_AVATAR}
					alt={pubkey}
					className="h-6 w-6 rounded object-cover"
				/>
			</div>
			<div className="flex w-full flex-1 items-start justify-between">
				<div className="flex items-baseline gap-2 text-base">
					<span className="font-semibold leading-none text-white">
						{user?.nip05 || user?.name || shortenKey(pubkey)}
					</span>
					<span className="leading-none text-zinc-500">·</span>
					<span className="leading-none text-zinc-500">
						{dayjs().to(dayjs.unix(time), true)}
					</span>
				</div>
			</div>
		</div>
	);
}
