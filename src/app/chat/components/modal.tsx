import { Dialog, Transition } from "@headlessui/react";
import { getPlebs } from "@libs/storage";
import { CancelIcon, PlusIcon } from "@shared/icons";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useQuery } from "@tanstack/react-query";
import { nip19 } from "nostr-tools";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

export function NewMessageModal() {
	const navigate = useNavigate();

	const { status, data }: any = useQuery(["plebs"], async () => {
		return await getPlebs();
	});

	const [isOpen, setIsOpen] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	const openChat = (npub: string) => {
		const pubkey = nip19.decode(npub).data;
		closeModal();
		navigate(`/app/chat/${pubkey}`);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => openModal()}
				className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5"
			>
				<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
					<PlusIcon width={12} height={12} className="text-zinc-500" />
				</div>
				<div>
					<h5 className="font-medium text-zinc-400">New chat</h5>
				</div>
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
									<div className="flex flex-col gap-2">
										<div className="flex items-center justify-between">
											<Dialog.Title
												as="h3"
												className="text-lg font-semibold leading-none text-zinc-100"
											>
												New chat
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
										<Dialog.Description className="text-sm leading-tight text-zinc-400">
											All messages will be encrypted, but anyone can see who you
											chat
										</Dialog.Description>
									</div>
								</div>
								<div className="h-[500px] flex flex-col pb-5 overflow-x-hidden overflow-y-auto">
									{status === "loading" ? (
										<p>Loading...</p>
									) : (
										data.map((pleb) => (
											<div
												key={pleb.npub}
												className="group flex items-center justify-between px-4 py-3 hover:bg-zinc-800"
											>
												<div className="flex items-center gap-2">
													<img
														alt={pleb.npub}
														src={pleb.image || DEFAULT_AVATAR}
														className="w-9 h-9 shrink-0 object-cover rounded"
													/>
													<div className="inline-flex flex-col gap-1">
														<h3 className="leading-none max-w-[15rem] line-clamp-1 font-medium text-zinc-100">
															{pleb.display_name || pleb.name}
														</h3>
														<span className="leading-none max-w-[10rem] line-clamp-1 text-sm text-zinc-400">
															{pleb.nip05 ||
																pleb.npub.substring(0, 16).concat("...")}
														</span>
													</div>
												</div>
												<div>
													<button
														type="button"
														onClick={() => openChat(pleb.npub)}
														className="inline-flex text-sm w-max px-3 py-1.5 rounded border-t border-zinc-600/50 bg-zinc-700 hover:bg-fuchsia-500 transform translate-x-20 group-hover:translate-x-0 transition-transform ease-in-out duration-150"
													>
														Chat
													</button>
												</div>
											</div>
										))
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
