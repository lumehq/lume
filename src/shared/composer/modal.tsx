import { Dialog, Transition } from "@headlessui/react";
import CancelIcon from "@icons/cancel";
import ChevronDownIcon from "@icons/chevronDown";
import ChevronRightIcon from "@icons/chevronRight";
import ComposeIcon from "@icons/compose";
import { Post } from "@shared/composer/types/post";
import { User } from "@shared/composer/user";
import { useActiveAccount } from "@stores/accounts";
import { Fragment, useState } from "react";

export function ComposerModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [composer] = useState({ type: "post" });

	const account = useActiveAccount((state: any) => state.account);

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => openModal()}
				className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-md bg-fuchsia-500 px-2.5 text-sm font-medium text-white shadow-button hover:bg-fuchsia-600 focus:outline-none"
			>
				<ComposeIcon width={14} height={14} />
				Compose
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
							<Dialog.Panel className="relative h-min w-full max-w-xl rounded-lg border border-zinc-800 bg-zinc-900">
								<div className="flex items-center justify-between px-4 py-4">
									<div className="flex items-center gap-2">
										<div>{account && <User pubkey={account.pubkey} />}</div>
										<span>
											<ChevronRightIcon
												width={14}
												height={14}
												className="text-zinc-500"
											/>
										</span>
										<div className="inline-flex h-6 w-max items-center justify-center gap-0.5 rounded bg-zinc-800 pl-3 pr-1.5 text-base font-medium text-zinc-400 shadow-mini-button">
											New Post
											<ChevronDownIcon width={14} height={14} />
										</div>
									</div>
									<div
										onClick={closeModal}
										onKeyDown={closeModal}
										className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800"
									>
										<CancelIcon
											width={16}
											height={16}
											className="text-zinc-500"
										/>
									</div>
								</div>
								{composer.type === "post" && account && (
									<Post pubkey={account.pubkey} privkey={account.privkey} />
								)}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
