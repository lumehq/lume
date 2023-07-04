import { User } from "@app/auth/components/user";
import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import { createBlock } from "@libs/storage";
import { CancelIcon, CheckCircleIcon, CommandIcon } from "@shared/icons";
import { DEFAULT_AVATAR } from "@stores/constants";
import { ADD_FEEDBLOCK_SHORTCUT } from "@stores/shortcuts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "@utils/hooks/useAccount";
import { nip19 } from "nostr-tools";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";

export function AddFeedBlock() {
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState([]);
	const [query, setQuery] = useState("");

	const { status, account } = useAccount();

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	useHotkeys(ADD_FEEDBLOCK_SHORTCUT, () => openModal());

	const block = useMutation({
		mutationFn: (data: any) => {
			return createBlock(data.kind, data.title, data.content);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { isDirty, isValid },
	} = useForm();

	const onSubmit = (data: any) => {
		setLoading(true);

		selected.forEach((item, index) => {
			if (item.substring(0, 4) === "npub") {
				selected[index] = nip19.decode(item).data;
			}
		});

		// insert to database
		block.mutate({
			kind: 1,
			title: data.title,
			content: JSON.stringify(selected),
		});

		setLoading(false);
		// reset form
		reset();
		// close modal
		closeModal();
	};

	return (
		<>
			<button
				type="button"
				onClick={() => openModal()}
				className="inline-flex w-56 h-9 items-center justify-start gap-2.5 rounded-md px-2.5"
			>
				<div className="flex items-center gap-2">
					<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
						<CommandIcon width={12} height={12} className="text-zinc-500" />
					</div>
					<div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
						<span className="text-zinc-500 text-sm leading-none">F</span>
					</div>
				</div>
				<div>
					<h5 className="font-medium text-zinc-400">New feed block</h5>
				</div>
			</button>
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
							<Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-xl border-t border-zinc-800/50 bg-zinc-900">
								<div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
									<div className="flex flex-col gap-1">
										<div className="flex items-center justify-between">
											<Dialog.Title
												as="h3"
												className="text-lg font-semibold leading-none text-zinc-100"
											>
												Create feed block
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
											Specific newsfeed space for people you want to keep up to
											date
										</Dialog.Description>
									</div>
								</div>
								<div className="flex h-full w-full flex-col overflow-y-auto px-5 pb-5 pt-3">
									<form
										onSubmit={handleSubmit(onSubmit)}
										className="flex h-full w-full flex-col gap-4 mb-0"
									>
										<div className="flex flex-col gap-1">
											<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
												Title *
											</label>
											<input
												type={"text"}
												{...register("title", {
													required: true,
												})}
												spellCheck={false}
												className="relative h-10 w-full rounded-md px-3 py-2 !outline-none placeholder:text-zinc-500 bg-zinc-800 text-zinc-100"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
												Choose at least 1 user *
											</label>
											<div className="w-full h-[300px] flex flex-col rounded-lg border-t border-zinc-700/50 bg-zinc-800 overflow-x-hidden overflow-y-auto">
												<div className="w-full px-3 py-2">
													<Combobox
														value={selected}
														onChange={setSelected}
														multiple
													>
														<Combobox.Input
															onChange={(event) => setQuery(event.target.value)}
															spellCheck={false}
															autoFocus={false}
															placeholder="Enter pubkey or npub..."
															className="mb-2 relative h-10 w-full rounded-md px-3 py-2 !outline-none placeholder:text-zinc-500 bg-zinc-700 text-zinc-100"
														/>
														<Combobox.Options static>
															{query.length > 0 && (
																<Combobox.Option
																	value={query}
																	className="group w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-700"
																>
																	{({ selected }) => (
																		<>
																			<div className="flex items-center gap-2">
																				<img
																					alt={query}
																					src={DEFAULT_AVATAR}
																					className="w-11 h-11 shrink-0 object-cover rounded"
																				/>
																				<div className="inline-flex flex-col gap-1">
																					<span className="text-base leading-tight text-zinc-400">
																						{query}
																					</span>
																				</div>
																			</div>
																			{selected && (
																				<CheckCircleIcon className="w-4 h-4 text-green-500" />
																			)}
																		</>
																	)}
																</Combobox.Option>
															)}
															{status === "loading" ? (
																<p>Loading...</p>
															) : (
																JSON.parse(account.follows).map((follow) => (
																	<Combobox.Option
																		key={follow}
																		value={follow}
																		className="group w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-700"
																	>
																		{({ selected }) => (
																			<>
																				<User pubkey={follow} />
																				{selected && (
																					<CheckCircleIcon className="w-4 h-4 text-green-500" />
																				)}
																			</>
																		)}
																	</Combobox.Option>
																))
															)}
														</Combobox.Options>
													</Combobox>
												</div>
											</div>
										</div>
										<div>
											<button
												type="submit"
												disabled={!isDirty || !isValid}
												className="inline-flex h-11 w-full transform items-center justify-center rounded-lg bg-fuchsia-500 font-medium text-zinc-100 shadow-button active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
											>
												{loading ? (
													<svg
														className="h-4 w-4 animate-spin text-black dark:text-zinc-100"
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
		</>
	);
}
