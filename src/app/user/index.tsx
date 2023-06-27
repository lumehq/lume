import { usePublish } from "@libs/ndk";
import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useQuery } from "@tanstack/react-query";
import { useFollows } from "@utils/hooks/useFollows";
import { useProfile } from "@utils/hooks/useProfile";
import { compactNumber } from "@utils/number";
import { shortenKey } from "@utils/shortenKey";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function UserScreen() {
	const publish = usePublish();
	const [followed, setFollowed] = useState(false);

	const { pubkey } = useParams();
	const { user } = useProfile(pubkey);
	const { status: followsStatus, follows } = useFollows();
	const {
		status: userStatsStatus,
		data: userStats,
		error,
	} = useQuery(["user", pubkey], async () => {
		const res = await fetch(
			`https://api.nostr.band/v0/stats/profile/${pubkey}`,
		);
		if (!res.ok) {
			throw new Error("Error");
		}
		return await res.json();
	});

	const follow = (pubkey: string) => {
		try {
			const followsAsSet = new Set(follows);
			followsAsSet.add(pubkey);

			const tags = [];
			followsAsSet.forEach((item) => {
				tags.push(["p", item]);
			});

			// publish event
			publish({ content: "", kind: 3, tags: tags });

			// update state
			setFollowed(true);
		} catch (error) {
			console.log(error);
		}
	};

	const unfollow = (pubkey: string) => {
		try {
			const followsAsSet = new Set(follows);
			followsAsSet.delete(pubkey);

			const tags = [];
			followsAsSet.forEach((item) => {
				tags.push(["p", item]);
			});

			// publish event
			publish({ content: "", kind: 3, tags: tags });

			// update state
			setFollowed(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (followsStatus === "success" && follows) {
			if (follows.includes(pubkey)) {
				setFollowed(true);
			}
		}
	}, [followsStatus]);

	return (
		<div className="h-full w-full">
			<div
				data-tauri-drag-region
				className="h-11 w-full flex items-center px-3 border-b border-zinc-900"
			/>
			<div className="w-full h-56 bg-zinc-100">
				<Image
					src={user?.banner}
					fallback="https://void.cat/d/QY1myro5tkHVs2nY7dy74b.jpg"
					alt={"banner"}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="w-full px-5 -mt-7">
				<div>
					<Image
						src={user?.image}
						fallback={DEFAULT_AVATAR}
						alt={pubkey}
						className="w-14 h-14 rounded-md ring-2 ring-black"
					/>
					<div className="flex-1 flex flex-col gap-2 mt-4">
						<h5 className="font-semibold leading-none">
							{user?.displayName || user?.name || "No name"}
						</h5>
						<span className="max-w-[15rem] text-sm truncate leading-none text-zinc-500">
							{user?.nip05 || shortenKey(pubkey)}
						</span>
						<p className="mt-1 line-clamp-3 break-words leading-tight text-zinc-100">
							{user?.about}
						</p>
					</div>
				</div>
				<div className="mt-8">
					{error && <p>Failed to fetch user stats</p>}
					{userStatsStatus === "loading" ? (
						<p>Loading...</p>
					) : (
						<div className="w-full flex items-center gap-10">
							<div className="inline-flex flex-col gap-1">
								<span className="leading-none font-semibold text-zinc-100">
									{userStats.stats[pubkey].followers_pubkey_count ?? 0}
								</span>
								<span className="leading-none text-sm text-zinc-400">
									Followers
								</span>
							</div>
							<div className="inline-flex flex-col gap-1">
								<span className="leading-none font-semibold text-zinc-100">
									{userStats.stats[pubkey].pub_following_pubkey_count ?? 0}
								</span>
								<span className="leading-none text-sm text-zinc-400">
									Following
								</span>
							</div>
							<div className="inline-flex flex-col gap-1">
								<span className="leading-none font-semibold text-zinc-100">
									{userStats.stats[pubkey].zaps_received
										? compactNumber.format(
												userStats.stats[pubkey].zaps_received.msats / 1000,
										  )
										: 0}
								</span>
								<span className="leading-none text-sm text-zinc-400">
									Zaps received
								</span>
							</div>
							<div className="inline-flex flex-col gap-1">
								<span className="leading-none font-semibold text-zinc-100">
									{userStats.stats[pubkey].zaps_sent
										? compactNumber.format(
												userStats.stats[pubkey].zaps_sent.msats / 1000,
										  )
										: 0}
								</span>
								<span className="leading-none text-sm text-zinc-400">
									Zaps sent
								</span>
							</div>
						</div>
					)}
					<div className="mt-6 flex items-center gap-2">
						{followsStatus === "loading" ? (
							<button
								type="button"
								className="inline-flex w-44 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
							>
								Loading...
							</button>
						) : followed ? (
							<button
								type="button"
								onClick={() => unfollow(pubkey)}
								className="inline-flex w-44 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
							>
								Unfollow
							</button>
						) : (
							<button
								type="button"
								onClick={() => follow(pubkey)}
								className="inline-flex w-44 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
							>
								Follow
							</button>
						)}
						<Link
							to={`/app/chat/${pubkey}`}
							className="inline-flex w-44 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
						>
							Message
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
