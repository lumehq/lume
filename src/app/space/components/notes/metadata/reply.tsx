import { Dialog, Transition } from "@headlessui/react";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { ReplyIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { dateToUnix } from "@utils/date";
import { compactNumber } from "@utils/number";
import { Fragment, useContext, useState } from "react";

export function NoteReply({ id, replies }: { id: string; replies: number }) {
	const ndk = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const [count, setCount] = useState(replies);
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useState("");

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	const submitEvent = () => {
		const signer = new NDKPrivateKeySigner(account.privkey);
		ndk.signer = signer;

		const event = new NDKEvent(ndk);
		// build event
		event.content = value;
		event.kind = 1;
		event.created_at = dateToUnix();
		event.pubkey = account.pubkey;
		event.tags = [["e", id]];

		// publish event
		event.publish();

		// close modal
		setIsOpen(false);
		// increment replies
		setCount(count + 1);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => openModal()}
				className="w-20 group inline-flex items-center gap-1.5"
			>
				<ReplyIcon
					width={16}
					height={16}
					className="text-zinc-400 group-hover:text-green-400"
				/>
				<span className="text-base leading-none text-zinc-400 group-hover:text-white">
					{compactNumber.format(count)}
				</span>
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
							<Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
								{/* root note */}
								{/* comment form */}
								<div className="flex gap-2">
									<div>
										<div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10">
											<Image
												src={account?.image}
												alt="user's avatar"
												className="h-11 w-11 rounded-md object-cover"
											/>
										</div>
									</div>
									<div className="relative h-24 w-full flex-1 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
										<div>
											<textarea
												name="content"
												onChange={(e) => setValue(e.target.value)}
												placeholder="Send your comment"
												className="relative h-24 w-full resize-none rounded-md border border-black/5 px-3.5 py-3 text-base shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
												spellCheck={false}
											/>
										</div>
										<div className="absolute bottom-2 w-full px-2">
											<div className="flex w-full items-center justify-between bg-zinc-800">
												<div className="flex items-center gap-2 divide-x divide-zinc-700">
													<div className="flex items-center gap-2 pl-2" />
												</div>
												<div className="flex items-center gap-2">
													<button
														type="button"
														onClick={() => submitEvent()}
														disabled={value.length === 0 ? true : false}
														className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-base font-medium shadow-md shadow-fuchsia-900/50 hover:bg-fuchsia-600"
													>
														<span className="text-white drop-shadow">Send</span>
													</button>
												</div>
											</div>
										</div>
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
