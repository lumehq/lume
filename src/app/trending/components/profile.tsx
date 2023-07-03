import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useQuery } from "@tanstack/react-query";
import { useSocial } from "@utils/hooks/useSocial";
import { compactNumber } from "@utils/number";
import { shortenKey } from "@utils/shortenKey";
import { useEffect, useState } from "react";

export function Profile({ data }: { data: any }) {
	const { status, data: userStats } = useQuery(
		["user-stats", data.pubkey],
		async () => {
			const res = await fetch(
				`https://api.nostr.band/v0/stats/profile/${data.pubkey}`,
			);
			return res.json();
		},
	);

	const embedProfile = data.profile ? JSON.parse(data.profile.content) : null;
	const profile = embedProfile;
	const { status: socialStatus, userFollows, follow, unfollow } = useSocial();

	const [followed, setFollowed] = useState(false);


	const followUser = (pubkey: string) => {
		try {
			follow(pubkey);

			// // update state
			setFollowed(true);
		} catch (error) {
			console.log(error);
		}
	};

	const unfollowUser = (pubkey: string) => {
		try {
			unfollow(pubkey);

			// // update state
			setFollowed(false);
		} catch (error) {
			console.log(error);
		}
	};


	useEffect(() => {
		if (status === "success" && userFollows) {
			if (userFollows.includes(data.pubkey)) {
				setFollowed(true);
			}
		}
	}, [status]);

	if (!profile)
		return (
			<div className="rounded-md bg-zinc-900 px-5 py-5">
				<p>Can't fetch profile</p>
			</div>
		);

	return (
		<div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-5 py-5">
			<div className="flex items-center justify-between">
				<div className="inline-flex items-center gap-2">
					<div className="w-11 h-11 shrink-0">
						<Image
							src={profile.picture}
							fallback={DEFAULT_AVATAR}
							className="w-11 h-11 object-cover rounded-lg"
						/>
					</div>
					<div className="inline-flex flex-col gap-1">
						<h3 className="max-w-[15rem] truncate font-semibold text-zinc-100 leading-none">
							{profile.display_name || profile.name}
						</h3>
						<p className="max-w-[10rem] truncate text-sm text-zinc-400 leading-none">
							{profile.nip05 || shortenKey(data.pubkey)}
						</p>
					</div>
				</div>
				<div className="inline-flex items-center gap-2">
					{socialStatus === "loading" ? (
						<button
							type="button"
							className="inline-flex w-36 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
						>
							Loading...
						</button>
					) : followed ? (
					<button type="button" onClick={() => unfollowUser(data.pubkey)}>Unfollow</button>
					) : (
					<button type="button" onClick={() => followUser(data.pubkey)}>Follow</button>
					)}
				</div>
			</div>
			<div className="mt-2">
				<p className="whitespace-pre-line break-words text-zinc-100">
					{profile.about || profile.bio}
				</p>
			</div>
			<div className="mt-8">
				{status === "loading" ? (
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
