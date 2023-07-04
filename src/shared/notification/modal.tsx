import { NotificationUser } from "./user";
import { Dialog, Transition } from "@headlessui/react";
import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { BellIcon, CancelIcon, LoaderIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { User } from "@shared/user";
import { useQuery } from "@tanstack/react-query";
import { dateToUnix, getHourAgo } from "@utils/date";
import { Fragment, useContext, useRef, useState } from "react";

export function NotificationModal({ pubkey }: { pubkey: string }) {
	const ndk = useContext(RelayContext);
	const now = useRef(new Date());

	const [isOpen, setIsOpen] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const { status, data } = useQuery(
		["user-notification", pubkey],
		async () => {
			const filter: NDKFilter = {
				"#p": [pubkey],
				kinds: [1, 6, 7, 9735],
				since: dateToUnix(getHourAgo(48, now.current)),
			};
			const events = await ndk.fetchEvents(filter);
			return [...events];
		},
		{
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
		},
	);

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	const renderItem = (event: NDKEvent) => {
		if (event.kind === 1) {
			return (
				<div key={event.id} className="flex flex-col px-5 py-2">
					<User pubkey={event.pubkey} time={event.created_at} isChat={true} />
					<div className="-mt-[20px] pl-[49px]">
						<p className="select-text whitespace-pre-line break-words text-base text-zinc-100">
							{event.content}
						</p>
					</div>
				</div>
			);
		}

		if (event.kind === 6) {
			return (
				<div key={event.id} className="flex flex-col px-5 py-2">
					<NotificationUser pubkey={event.pubkey} desc="repost your post" />
				</div>
			);
		}

		if (event.kind === 7) {
			return (
				<div key={event.id} className="flex flex-col px-5 py-2">
					<NotificationUser pubkey={event.pubkey} desc="liked your post" />
				</div>
			);
		}

		if (event.kind === 9735) {
			return (
				<div key={event.id} className="flex flex-col px-5 py-2">
					<NotificationUser pubkey={event.pubkey} desc="zapped your post" />
				</div>
			);
		}

		return <div className="flex flex-col px-5 py-2">{event.content}</div>;
	};

	return (
		<>
			<button
				type="button"
				onClick={() => openModal()}
				aria-label="Notification"
				className="inline-flex items-center justify-center w-9 h-9 rounded-md border-t bg-zinc-800 border-zinc-700/50 transform active:translate-y-1"
			>
				<BellIcon className="w-4 h-4 text-zinc-400" />
			</button>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md" />
					</Transition.Child>
					<div className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border-t border-zinc-800/50 bg-zinc-900">
								<div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
									<div className="flex flex-col gap-1">
										<div className="flex items-center justify-between">
											<Dialog.Title
												as="h3"
												className="text-lg font-semibold leading-none text-zinc-100"
											>
												Notification
											</Dialog.Title>
											<button
												type="button"
												onClick={closeModal}
												className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
											>
												<CancelIcon className="w-5 h-5 text-zinc-300" />
											</button>
										</div>
										<Dialog.Description className="text-sm leading-tight text-zinc-400">
											All things happen when you rest in 48 hours ago
										</Dialog.Description>
									</div>
								</div>
								<div className="h-[500px] flex flex-col pb-5 overflow-x-hidden overflow-y-auto">
									{status === "loading" ? (
										<div className="px-4 py-3 inline-flex items-center justify-center">
											<LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
										</div>
									) : data.length < 1 ? (
										<div className="flex flex-col items-center justify-center w-full h-full">
											<p className="text-4xl mb-1">🎉</p>
											<p className="text-zinc-500 font-medium">
												Yo!, you've no new notifications
											</p>
										</div>
									) : (
										data.map((event) => renderItem(event))
									)}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
