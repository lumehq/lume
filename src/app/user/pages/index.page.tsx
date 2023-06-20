import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { DEFAULT_AVATAR } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { usePageContext } from "@utils/hooks/usePageContext";
import { useProfile } from "@utils/hooks/useProfile";
import { compactNumber } from "@utils/number";
import { shortenKey } from "@utils/shortenKey";
import { useContext } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Page() {
	const ndk = useContext(RelayContext);
	const pageContext = usePageContext();
	const searchParams: any = pageContext.urlParsed.search;
	const pubkey = searchParams.pubkey;

	const { user } = useProfile(pubkey);
	const { data: userStats, error } = useSWR(
		`https://api.nostr.band/v0/stats/profile/${pubkey}`,
		fetcher,
	);

	const account = useActiveAccount((state: any) => state.account);
	const follows = account ? JSON.parse(account.follows) : [];

	const follow = (pubkey: string) => {
		try {
			const followsAsSet = new Set(follows);
			followsAsSet.add(pubkey);

			const signer = new NDKPrivateKeySigner(account.privkey);
			ndk.signer = signer;

			const tags = [];
			followsAsSet.forEach((item) => {
				tags.push(["p", item]);
			});

			const event = new NDKEvent(ndk);
			event.content = "";
			event.created_at = dateToUnix();
			event.pubkey = pubkey;
			event.kind = 3;
			event.tags = tags;
			// publish event
			event.publish();
		} catch (error) {
			console.log(error);
		}
	};

	const unfollow = (pubkey: string) => {
		try {
			const followsAsSet = new Set(follows);
			followsAsSet.delete(pubkey);

			const signer = new NDKPrivateKeySigner(account.privkey);
			ndk.signer = signer;

			const tags = [];
			followsAsSet.forEach((item) => {
				tags.push(["p", item]);
			});

			const event = new NDKEvent(ndk);
			event.content = "";
			event.created_at = dateToUnix();
			event.pubkey = pubkey;
			event.kind = 3;
			event.tags = tags;
			// publish event
			event.publish();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="h-full w-full">
			<div
				data-tauri-drag-region
				className="h-11 w-full flex items-center px-3 border-b border-zinc-900"
			/>
			<div className="w-full h-56 bg-zinc-100">
				<Image
					src={user?.banner || "https://void.cat/d/QY1myro5tkHVs2nY7dy74b.jpg"}
					alt={"banner"}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="w-full px-5 -mt-7">
				<div>
					<Image
						src={user?.image || DEFAULT_AVATAR}
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
					{!userStats ? (
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
						{follows.includes(pubkey) ? (
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
						<a
							href={`/app/chat?pubkey=${pubkey}`}
							className="inline-flex w-44 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
						>
							Message
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
