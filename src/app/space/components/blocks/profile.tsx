import { ArrowLeftIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { useActiveAccount } from "@stores/accounts";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { compactNumber } from "@utils/number";
import { shortenKey } from "@utils/shortenKey";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ProfileBlock({ params }: { params: any }) {
	const removeBlock = useActiveAccount((state: any) => state.removeBlock);

	const close = () => {
		removeBlock(params.id, true);
	};

	const { user } = useProfile(params.pubkey);
	const { data: userStats } = useSWR(
		user ? `https://api.nostr.band/v0/stats/profile/${params.pubkey}` : null,
		fetcher,
	);

	return (
		<div className="shrink-0 w-[360px] flex-col flex border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full flex items-center justify-center px-3"
			>
				<button
					type="button"
					onClick={() => close()}
					className="inline-flex h-7 w-7 shrink items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800"
				>
					<ArrowLeftIcon width={14} height={14} className="text-zinc-500" />
				</button>
				<h3 className="font-semibold text-zinc-100">{params.title}</h3>
				<div className="w-9 h-6" />
			</div>
			<div className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 pb-20 overflow-y-auto">
				<div className="px-3">
					<div className="w-full h-max rounded-lg bg-zinc-900">
						<div className="bg-zinc-800 w-full h-44 rounded-t-lg" />
						<div className="-mt-7 px-5">
							<Image
								src={user?.image || DEFAULT_AVATAR}
								alt={params.pubkey}
								className="w-14 h-14 ring-1 ring-black rounded-md"
							/>
							<div className="mt-4">
								<div className="flex flex-col gap-1">
									<h3 className="leading-none font-semibold text-zinc-100">
										{user?.display_name || user?.name || "Anon"}
									</h3>
									<h5 className="leading-none text-zinc-500">
										{user?.nip05 || shortenKey(params.pubkey)}
									</h5>
									<p className="mt-1 select-text break-words text-base text-zinc-100">
										{user?.bio || user.about}
									</p>
								</div>
								{!userStats ? (
									<p>Loading...</p>
								) : (
									<div className="mt-8 pb-5 w-full flex items-center gap-8">
										<div className="inline-flex flex-col gap-1">
											<span className="leading-none font-semibold text-zinc-100">
												{userStats.stats[params.pubkey]
													.followers_pubkey_count ?? 0}
											</span>
											<span className="leading-none text-sm text-zinc-400">
												Followers
											</span>
										</div>
										<div className="inline-flex flex-col gap-1">
											<span className="leading-none font-semibold text-zinc-100">
												{userStats.stats[params.pubkey]
													.pub_following_pubkey_count ?? 0}
											</span>
											<span className="leading-none text-sm text-zinc-400">
												Following
											</span>
										</div>
										<div className="inline-flex flex-col gap-1">
											<span className="leading-none font-semibold text-zinc-100">
												{userStats.stats[params.pubkey].zaps_received
													? compactNumber.format(
															userStats.stats[params.pubkey].zaps_received
																.msats / 1000,
													  )
													: 0}
											</span>
											<span className="leading-none text-sm text-zinc-400">
												Zaps received
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
