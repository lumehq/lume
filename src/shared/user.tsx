import { Popover, Transition } from "@headlessui/react";
import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { formatCreatedAt } from "@utils/createdAt";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export function User({
	pubkey,
	time,
	size,
	repost,
	isChat = false,
}: {
	pubkey: string;
	time: number;
	size?: string;
	repost?: boolean;
	isChat?: boolean;
}) {
	const { user } = useProfile(pubkey);
	const createdAt = formatCreatedAt(time, isChat);

	const avatarWidth = size === "small" ? "w-6" : "w-11";
	const avatarHeight = size === "small" ? "h-6" : "h-11";

	return (
		<Popover
			className={`relative flex gap-3 ${
				size === "small" ? "items-center" : "items-start"
			}`}
		>
			<Popover.Button
				className={`${avatarWidth} ${avatarHeight} relative z-10 bg-zinc-900 shrink-0 overflow-hidden`}
			>
				<Image
					src={user?.image}
					fallback={DEFAULT_AVATAR}
					alt={pubkey}
					className={`${avatarWidth} ${avatarHeight} ${
						size === "small" ? "rounded" : "rounded-lg"
					} object-cover`}
				/>
			</Popover.Button>
			<div className="flex flex-wrap items-baseline gap-1">
				<h5
					className={`text-zinc-200 font-medium leading-none truncate ${
						size === "small" ? "max-w-[7rem]" : "max-w-[10rem]"
					}`}
				>
					{user?.nip05 || user?.name || shortenKey(pubkey)}
				</h5>
				{repost && (
					<span className="font-semibold leading-none text-fuchsia-500">
						{" "}
						reposted
					</span>
				)}
				<span className="leading-none text-zinc-500">·</span>
				<span className="leading-none text-zinc-500">{createdAt}</span>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1"
			>
				<Popover.Panel className="absolute left-0 top-10 z-50 mt-3">
					<div className="w-full max-w-xs overflow-hidden rounded-md border border-zinc-800/50 bg-zinc-900/90 backdrop-blur-lg">
						<div className="flex gap-2.5 border-b border-zinc-800 px-3 py-3">
							<Image
								src={user?.image}
								fallback={DEFAULT_AVATAR}
								alt={pubkey}
								className="h-11 w-11 shrink-0 rounded-lg object-cover"
							/>
							<div className="flex-1 flex flex-col gap-2">
								<div className="inline-flex flex-col gap-1">
									<h5 className="font-semibold leading-none">
										{user?.displayName || user?.name || (
											<div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700" />
										)}
									</h5>
									<span className="max-w-[15rem] text-sm truncate leading-none text-zinc-500">
										{user?.nip05 || shortenKey(pubkey)}
									</span>
								</div>
								<div>
									<p className="line-clamp-3 break-words text-sm leading-tight text-zinc-100">
										{user?.about}
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2 px-3 py-3">
							<Link
								to={`/app/user/${pubkey}`}
								className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-zinc-700 hover:bg-fuchsia-500 text-sm font-medium"
							>
								View profile
							</Link>
							<Link
								to={`/app/chat/${pubkey}`}
								className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-zinc-700 hover:bg-fuchsia-500 text-sm font-medium"
							>
								Message
							</Link>
						</div>
					</div>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
}
