import MutedItem from "@app/channel/components/mutedItem";

import MuteIcon from "@icons/mute";

import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function ChannelBlackList({ blacklist }: { blacklist: any }) {
	return (
		<Popover className="relative">
			{({ open }) => (
				<>
					<Popover.Button
						className={`group inline-flex h-8 w-8 items-center justify-center rounded-md ring-2 ring-zinc-950 focus:outline-none ${
							open
								? "bg-zinc-800 hover:bg-zinc-700"
								: "bg-zinc-900 hover:bg-zinc-800"
						}`}
					>
						<MuteIcon
							width={16}
							height={16}
							className="text-zinc-400 group-hover:text-white"
						/>
					</Popover.Button>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel className="absolute right-0 z-10 mt-1 w-screen max-w-xs transform px-4 sm:px-0">
							<div className="flex flex-col gap-2 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-popover">
								<div className="h-min w-full shrink-0 border-b border-zinc-800 p-3">
									<div className="flex flex-col gap-0.5">
										<h3 className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text font-semibold leading-none text-transparent">
											Your muted list
										</h3>
										<p className="text-base leading-tight text-zinc-400">
											Currently, unmute only affect locally, when you move to
											new client, muted list will loaded again
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-2 px-3 pb-3 pt-1">
									{blacklist.map((item: any) => (
										<MutedItem key={item.id} data={item} />
									))}
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
}
