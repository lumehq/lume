import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { compactNumber } from "@utils/number";
import { shortenKey } from "@utils/shortenKey";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Profile({ data }: { data: any }) {
	const { data: userStats, error } = useSWR(
		`https://api.nostr.band/v0/stats/profile/${data.pubkey}`,
		fetcher,
	);

	const embedProfile = data.profile ? JSON.parse(data.profile.content) : null;
	const profile = embedProfile;

	if (!profile)
		return (
			<div className="rounded-md bg-zinc-900 px-5 py-5">
				<p>Can't fetch profile</p>
			</div>
		);

	return (
		<div className="rounded-md bg-zinc-900 px-5 py-5">
			<div className="flex items-center gap-2">
				<div className="w-12 h-12 shrink-0">
					<Image
						src={profile.picture || DEFAULT_AVATAR}
						className="w-12 h-12 object-cover rounded"
					/>
				</div>
				<div className="inline-flex flex-col gap-1">
					<h3 className="max-w-[15rem] truncate font-semibold text-zinc-100 leading-none">
						{profile.display_name || profile.name}
					</h3>
					<p className="text-sm text-zinc-400 leading-none">
						{profile.nip05 || shortenKey(data.pubkey)}
					</p>
				</div>
			</div>
			<div className="mt-2">
				<p className="whitespace-pre-line break-words text-zinc-100">
					{profile.about || profile.bio}
				</p>
			</div>
			<div className="mt-8">
				{error && <p>Failed to fetch</p>}
				{!userStats ? (
					<p>Loading...</p>
				) : (
					<div className="w-full flex items-center gap-8">
						<div className="inline-flex flex-col gap-1">
							<span className="leading-none font-semibold text-zinc-100">
								{userStats.stats[data.pubkey].followers_pubkey_count ?? 0}
							</span>
							<span className="leading-none text-sm text-zinc-400">
								Followers
							</span>
						</div>
						<div className="inline-flex flex-col gap-1">
							<span className="leading-none font-semibold text-zinc-100">
								{userStats.stats[data.pubkey].pub_following_pubkey_count ?? 0}
							</span>
							<span className="leading-none text-sm text-zinc-400">
								Following
							</span>
						</div>
						<div className="inline-flex flex-col gap-1">
							<span className="leading-none font-semibold text-zinc-100">
								{userStats.stats[data.pubkey].zaps_received
									? compactNumber.format(
											userStats.stats[data.pubkey].zaps_received.msats / 1000,
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
	);
}
