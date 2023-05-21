import { Image } from "@shared/image";

import { DEFAULT_AVATAR, IMGPROXY_URL } from "@stores/constants";

import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

import { Popover, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Fragment } from "react";

dayjs.extend(relativeTime);

export function NoteDefaultUser({
	pubkey,
	time,
}: { pubkey: string; time: number }) {
	const { user } = useProfile(pubkey);

	return (
		<Popover className="relative flex items-start gap-3">
			<Popover.Button className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-zinc-900">
				<Image
					src={`${IMGPROXY_URL}/rs:fit:100:100/plain/${
						user?.picture ? user.picture : DEFAULT_AVATAR
					}`}
					alt={pubkey}
					className="h-11 w-11 object-cover"
				/>
			</Popover.Button>
			<div className="flex flex-wrap items-baseline gap-1">
				<h5 className="max-w-[15rem] text-base font-semibold leading-none truncate">
					{user?.nip05 || user?.name || shortenKey(pubkey)}
				</h5>
				<span className="leading-none text-zinc-500">·</span>
				<span className="leading-none text-zinc-500">
					{dayjs().to(dayjs.unix(time), true)}
				</span>
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
				<Popover.Panel className="absolute left-0 top-8 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-3xl">
					<div
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						className="w-full max-w-xs overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-input ring-1 ring-black ring-opacity-5"
					>
						<div className="flex items-start gap-2.5 border-b border-zinc-800 px-3 py-3">
							<Image
								src={`${IMGPROXY_URL}/rs:fit:200:200/plain/${
									user?.picture ? user.picture : DEFAULT_AVATAR
								}`}
								alt={pubkey}
								className="h-14 w-14 shrink-0 rounded-lg object-cover"
							/>
							<div className="flex w-full flex-1 flex-col gap-2">
								<div className="inline-flex w-2/3 flex-col gap-0.5">
									<h5 className="text-base font-semibold leading-none">
										{user?.display_name || user?.name || (
											<div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-700" />
										)}
									</h5>
									<span className="truncate text-base leading-none text-zinc-500">
										{user?.nip05 || shortenKey(pubkey)}
									</span>
								</div>
								<div>
									<p className="line-clamp-3 text-base leading-tight text-white">
										{user?.about}
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2 px-3 py-3">
							<a
								href={`/app/user?pubkey=${pubkey}`}
								className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-zinc-800 text-base font-medium"
							>
								View full profile
							</a>
							<a
								href={`/app/chat?pubkey=${pubkey}`}
								className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-zinc-800 text-base font-medium"
							>
								Message
							</a>
						</div>
					</div>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
}
