import { Dialog, Transition } from "@headlessui/react";
import { CancelIcon } from "@shared/icons";
import { useActiveAccount } from "@stores/accounts";
import { createBlock } from "@utils/storage";
import { nip19 } from "nostr-tools";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

export function AddFeedBlock({ parentState }: { parentState: any }) {
	const addBlock = useActiveAccount((state: any) => state.addBlock);

	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const closeModal = () => {
		// update local state
		setIsOpen(false);
		// update parent state
		parentState(false);
	};

	const {
		register,
		handleSubmit,
		reset,
		formState: { isDirty, isValid },
	} = useForm();

	const onSubmit = (data: any) => {
		setLoading(true);

		let pubkey = data.content;

		if (pubkey.substring(0, 4) === "npub") {
			pubkey = nip19.decode(pubkey).data;
		}

		// insert to database
		addBlock(1, data.title, pubkey);

		setTimeout(() => {
			setLoading(false);
			// reset form
			reset();
			// close modal
			closeModal();
		}, 1000);
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={closeModal}>
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
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<Dialog.Title
											as="h3"
											className="text-lg font-semibold leading-none text-white"
										>
											Create image block
										</Dialog.Title>
										<button
											type="button"
											onClick={closeModal}
											className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
										>
											<CancelIcon
												width={14}
												height={14}
												className="text-zinc-300"
											/>
										</button>
									</div>
									<Dialog.Description className="text-sm leading-tight text-zinc-400">
										Pin your favorite image to Space then you can view every
										time that you use Lume, your image will be broadcast to
										Nostr Relay as well
									</Dialog.Description>
								</div>
							</div>
							<div className="flex h-full w-full flex-col overflow-y-auto px-5 pb-5 pt-3">
								<form
									onSubmit={handleSubmit(onSubmit)}
									className="flex h-full w-full flex-col gap-4"
								>
									<div className="flex flex-col gap-1">
										<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
											Title *
										</label>
										<div className="relative w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[6px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[6px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
											<input
												type={"text"}
												{...register("title", {
													required: true,
												})}
												spellCheck={false}
												className="relative h-10 w-full rounded-md border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
											/>
										</div>
									</div>
									<div className="flex flex-col gap-1">
										<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
											Pubkey OR Npub *
										</label>
										<div className="relative w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[6px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[6px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
											<input
												type={"text"}
												{...register("content", {
													required: true,
												})}
												spellCheck={false}
												className="relative h-10 w-full rounded-md border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
											/>
										</div>
									</div>
									<div>
										<button
											type="submit"
											disabled={!isDirty || !isValid}
											className="inline-flex h-11 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 font-medium text-white shadow-button active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
										>
											{loading ? (
												<svg
													className="h-4 w-4 animate-spin text-black dark:text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<title id="loading">Loading</title>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													/>
												</svg>
											) : (
												"Confirm"
											)}
										</button>
									</div>
								</form>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}
