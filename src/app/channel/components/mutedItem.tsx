import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import { useState } from "react";

export function MutedItem({ data }: { data: any }) {
	const { user, isError, isLoading } = useProfile(data.content);
	const [status, setStatus] = useState(data.status);

	const unmute = async () => {
		const { updateItemInBlacklist } = await import("@libs/storage");
		const res = await updateItemInBlacklist(data.content, 0);
		if (res) {
			setStatus(0);
		}
	};

	const mute = async () => {
		const { updateItemInBlacklist } = await import("@libs/storage");
		const res = await updateItemInBlacklist(data.content, 1);
		if (res) {
			setStatus(1);
		}
	};

	return (
		<div className="flex items-center justify-between">
			{isError || isLoading ? (
				<>
					<div className="flex items-center gap-1.5">
						<div className="relative h-9 w-9 shrink animate-pulse rounded-md bg-zinc-800" />
						<div className="flex w-full flex-1 flex-col items-start gap-0.5 text-start">
							<div className="h-3 w-16 animate-pulse bg-zinc-800" />
							<div className="h-2 w-10 animate-pulse bg-zinc-800" />
						</div>
					</div>
				</>
			) : (
				<>
					<div className="flex items-center gap-1.5">
						<div className="relative h-9 w-9 shrink rounded-md">
							<Image
								src={user?.image || DEFAULT_AVATAR}
								alt={data.content}
								className="h-9 w-9 rounded-md object-cover"
							/>
						</div>
						<div className="flex w-full flex-1 flex-col items-start gap-0.5 text-start">
							<span className="truncate text-base font-medium leading-none text-zinc-100">
								{user?.displayName || user?.name || "Pleb"}
							</span>
							<span className="text-base leading-none text-zinc-400">
								{shortenKey(data.content)}
							</span>
						</div>
					</div>
					<div>
						{status === 1 ? (
							<button
								type="button"
								onClick={() => unmute()}
								className="inline-flex h-6 w-min items-center justify-center rounded px-1.5 text-base font-medium leading-none text-zinc-400 hover:bg-zinc-800 hover:text-fuchsia-500"
							>
								Unmute
							</button>
						) : (
							<button
								type="button"
								onClick={() => mute()}
								className="inline-flex h-6 w-min items-center justify-center rounded px-1.5 text-base font-medium leading-none text-zinc-400 hover:bg-zinc-800 hover:text-fuchsia-500"
							>
								Mute
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
}
