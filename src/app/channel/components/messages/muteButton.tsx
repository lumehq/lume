import { Dialog, Transition } from "@headlessui/react";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { CancelIcon, MuteIcon } from "@shared/icons";
import { RelayContext } from "@shared/relayProvider";
import { Tooltip } from "@shared/tooltip";
import { useActiveAccount } from "@stores/accounts";
import { useChannelMessages } from "@stores/channels";
import { dateToUnix } from "@utils/date";
import { Fragment, useContext, useState } from "react";

export function MessageMuteButton({ pubkey }: { pubkey: string }) {
	const ndk = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);
	const mute = useChannelMessages((state: any) => state.muteUser);

	const [isOpen, setIsOpen] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	const muteUser = () => {
		const signer = new NDKPrivateKeySigner(account.privkey);
		ndk.signer = signer;

		const event = new NDKEvent(ndk);
		// build event
		event.content = "";
		event.kind = 44;
		event.created_at = dateToUnix();
		event.pubkey = account.pubkey;
		event.tags = [["p", pubkey]];

		// publish event
		event.publish();

		// update state
		mute(pubkey);

		// close modal
		closeModal();
	};

	return (
		<>
			<Tooltip message="Mute this user">
				<button
					type="button"
					onClick={() => openModal()}
					className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-zinc-800"
				>
					<MuteIcon width={16} height={16} className="text-zinc-200" />
				</button>
			</Tooltip>
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
							<Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col rounded-lg border border-zinc-800 bg-zinc-900">
								<div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-6">
									<div className="flex flex-col gap-2">
										<div className="flex items-center justify-between">
											<Dialog.Title
												as="h3"
												className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-xl font-semibold leading-none text-transparent"
											>
												Are you sure!
											</Dialog.Title>
											<button
												type="button"
												onClick={closeModal}
												className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
											>
												<CancelIcon
													width={20}
													height={20}
													className="text-zinc-300"
												/>
											</button>
										</div>
										<Dialog.Description className="leading-tight text-zinc-400">
											You will no longer see messages from this user.
										</Dialog.Description>
									</div>
								</div>
								<div className="flex h-full w-full flex-col items-end justify-center overflow-y-auto px-5 py-2.5">
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={closeModal}
											className="inline-flex h-9 items-center justify-center rounded-md px-2 text-base font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
										>
											Cancel
										</button>
										<button
											type="button"
											onClick={() => muteUser()}
											className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-2 text-base font-medium text-white hover:bg-red-600"
										>
											Confirm
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
