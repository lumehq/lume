import ChannelsList from "@app/channel/components/list";
import ChatsList from "@app/chat/components/list";

import ActiveLink from "@shared/activeLink";
import { ComposerModal } from "@shared/composer/modal";
import EventCollector from "@shared/eventCollector";

import MyspaceIcon from "@icons/myspace";
import NavArrowDownIcon from "@icons/navArrowDown";
import ThreadsIcon from "@icons/threads";
import WorldIcon from "@icons/world";

import { Disclosure } from "@headlessui/react";

export default function Navigation() {
	return (
		<div className="flex w-[232px] h-full flex-col gap-3 pt-1.5">
			<div className="flex h-11 items-center justify-between px-3.5">
				<ComposerModal />
				<EventCollector />
			</div>
			{/* Newsfeed */}
			<div className="flex flex-col gap-0.5 px-1.5">
				<div className="px-2.5">
					<h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
						Feeds
					</h3>
				</div>
				<div className="flex flex-col text-zinc-400">
					<ActiveLink
						href="/app/space"
						className="flex h-8 items-center gap-2.5 rounded-md px-2.5 hover:text-white"
						activeClassName="bg-zinc-900/50 hover:bg-zinc-900"
					>
						<span className="inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900">
							<WorldIcon width={12} height={12} className="text-white" />
						</span>
						<span className="font-medium">Space</span>
					</ActiveLink>
					<ActiveLink
						href="/app/threads"
						className="flex h-8 items-center gap-2.5 rounded-md px-2.5 hover:text-white"
						activeClassName=""
					>
						<span className="inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900">
							<ThreadsIcon width={12} height={12} className="text-white" />
						</span>
						<span className="font-medium">Threads</span>
					</ActiveLink>
				</div>
			</div>
			{/* Channels */}
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<div className="flex flex-col gap-0.5 px-1.5">
						<Disclosure.Button className="flex items-center gap-1 px-2.5">
							<div
								className={`inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out ${
									open ? "" : "rotate-180"
								}`}
							>
								<NavArrowDownIcon
									width={12}
									height={12}
									className="text-zinc-700"
								/>
							</div>
							<h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
								Channels
							</h3>
						</Disclosure.Button>
						<Disclosure.Panel>
							<ChannelsList />
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>
			{/* Chats */}
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<div className="flex flex-col gap-0.5 px-1.5">
						<Disclosure.Button className="flex items-center gap-1 px-2.5">
							<div
								className={`inline-flex h-5 w-5 transform items-center justify-center transition-transform duration-150 ease-in-out ${
									open ? "" : "rotate-180"
								}`}
							>
								<NavArrowDownIcon
									width={12}
									height={12}
									className="text-zinc-700"
								/>
							</div>
							<h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
								Chats
							</h3>
						</Disclosure.Button>
						<Disclosure.Panel>
							<ChatsList />
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>
		</div>
	);
}
