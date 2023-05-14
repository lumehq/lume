import CancelIcon from "@icons/cancel";
import PlusIcon from "@icons/plus";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export function CreateViewModal() {
	const [isOpen, setIsOpen] = useState(false);

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
				onClick={openModal}
				className="inline-flex h-11 items-center overflow-hidden border-b border-transparent hover:bg-zinc-900"
			>
				<span className="inline-flex items-center gap-1 px-2 text-sm font-medium text-zinc-500">
					<PlusIcon width={14} height={14} />
					View
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
							<Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900">
								<div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-6">
									<div className="flex flex-col gap-1">
										<div className="flex items-center justify-between">
											<Dialog.Title
												as="h3"
												className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-xl font-semibold leading-none text-transparent"
											>
												Create a view
											</Dialog.Title>
											<button
												type="button"
												onClick={closeModal}
												className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
											>
												<CancelIcon
													width={16}
													height={16}
													className="text-zinc-400"
												/>
											</button>
										</div>
										<Dialog.Description className="text-sm leading-tight text-zinc-400">
											View is specific feature help you pin who you want to see
											in your feed. You can add maximum 5 people in a view.
										</Dialog.Description>
									</div>
								</div>
								<div className="flex h-full w-full flex-col overflow-y-auto pb-5 pt-3" />
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
