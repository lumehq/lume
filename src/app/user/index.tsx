import { UserFeed } from "@app/user/components/feed";
import { UserMetadata } from "@app/user/components/metadata";
import { Tab } from "@headlessui/react";
import { EditProfileModal } from "@shared/editProfileModal";
import { ThreadsIcon, ZapIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useAccount } from "@utils/hooks/useAccount";
import { useProfile } from "@utils/hooks/useProfile";
import { useSocial } from "@utils/hooks/useSocial";
import { shortenKey } from "@utils/shortenKey";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function UserScreen() {
	const { pubkey } = useParams();
	const { user } = useProfile(pubkey);
	const { account } = useAccount();
	const { status, userFollows, follow, unfollow } = useSocial();

	const [followed, setFollowed] = useState(false);

	const followUser = (pubkey: string) => {
		try {
			follow(pubkey);

			// update state
			setFollowed(true);
		} catch (error) {
			console.log(error);
		}
	};

	const unfollowUser = (pubkey: string) => {
		try {
			unfollow(pubkey);

			// update state
			setFollowed(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (status === "success" && userFollows) {
			if (userFollows.includes(pubkey)) {
				setFollowed(true);
			}
		}
	}, [status]);

	return (
		<div className="h-full w-full overflow-y-auto">
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
			<div className="w-full -mt-7">
				<div className="px-5">
					<Image
						src={user?.image}
						fallback={DEFAULT_AVATAR}
						alt={pubkey}
						className="w-14 h-14 rounded-md ring-2 ring-black"
					/>
					<div className="flex-1 flex flex-col gap-4 mt-2">
						<div className="flex items-center gap-16">
							<div className="inline-flex flex-col gap-1.5">
								<h5 className="font-semibold text-lg leading-none">
									{user?.displayName || user?.name || "No name"}
								</h5>
								<span className="max-w-[15rem] text-sm truncate leading-none text-zinc-500">
									{user?.nip05 || shortenKey(pubkey)}
								</span>
							</div>
							<div className="inline-flex items-center gap-2">
								{status === "loading" ? (
									<button
										type="button"
										className="inline-flex w-36 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
									>
										Loading...
									</button>
								) : followed ? (
									<button
										type="button"
										onClick={() => unfollowUser(pubkey)}
										className="inline-flex w-36 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
									>
										Unfollow
									</button>
								) : (
									<button
										type="button"
										onClick={() => followUser(pubkey)}
										className="inline-flex w-36 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
									>
										Follow
									</button>
								)}
								<Link
									to={`/app/chat/${pubkey}`}
									className="inline-flex w-36 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
								>
									Message
								</Link>
								<button
									type="button"
									className="inline-flex w-10 h-10 items-center justify-center rounded-md bg-zinc-900 group hover:bg-orange-500 text-sm font-medium"
								>
									<ZapIcon className="w-5 h-5" />
								</button>
								<span className="inline-flex mx-2 w-px h-4 bg-zinc-900" />
								{account && account.pubkey === pubkey && <EditProfileModal />}
							</div>
						</div>
						<div className="flex flex-col gap-8">
							<p className="mt-2 max-w-[500px] break-words select-text text-zinc-100">
								{user?.about}
							</p>
							<UserMetadata pubkey={pubkey} />
						</div>
					</div>
				</div>
				<div className="mt-8 w-full border-t border-zinc-900">
					<Tab.Group>
						<Tab.List className="px-5 mb-2">
							<Tab as={Fragment}>
								{({ selected }) => (
									<button
										type="button"
										className={`${
											selected
												? "text-fuchsia-500 border-fuchsia-500"
												: "text-zinc-200 border-transparent"
										} font-medium inline-flex items-center gap-2 h-10 border-t`}
									>
										<ThreadsIcon className="w-4 h-4" />
										Activities from 48 hours ago
									</button>
								)}
							</Tab>
						</Tab.List>
						<Tab.Panels>
							<Tab.Panel>
								<UserFeed pubkey={pubkey} />
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>
		</div>
	);
}
