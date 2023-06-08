import { Dialog, Transition } from "@headlessui/react";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { AvatarUploader } from "@shared/avatarUploader";
import { CancelIcon, PlusIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { DEFAULT_AVATAR } from "@stores/constants";
import { dateToUnix } from "@utils/date";
import { createChannel } from "@utils/storage";
import { Fragment, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { navigate } from "vite-plugin-ssr/client/router";

export function ChannelCreateModal() {
	const ndk = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState(DEFAULT_AVATAR);
	const [loading, setLoading] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { isDirty, isValid },
	} = useForm();

	const onSubmit = (data: any) => {
		setLoading(true);

		try {
			const signer = new NDKPrivateKeySigner(account.privkey);
			ndk.signer = signer;

			const event = new NDKEvent(ndk);
			// build event
			event.content = JSON.stringify(data);
			event.kind = 40;
			event.created_at = dateToUnix();
			event.pubkey = account.pubkey;
			event.tags = [];

			// publish event
			event.publish();

			// insert to database
			createChannel(event.id, event.pubkey, event.content, event.created_at);

			// reset form
			reset();

			setTimeout(() => {
				// close modal
				setIsOpen(false);
				// redirect to channel page
				navigate(`/app/channel?id=${event.id}`);
			}, 1000);
		} catch (e) {
			console.log("error: ", e);
		}
	};

	useEffect(() => {
		setValue("picture", image);
	}, [setValue, image]);

	return (
		<>
			<button
				type="button"
				onClick={() => openModal()}
				className="group inline-flex h-8 items-center gap-2.5 rounded-md px-2.5 hover:bg-zinc-900"
			>
				<div className="inline-flex h-5 w-5 shrink items-center justify-center rounded bg-zinc-900 group-hover:bg-zinc-800">
					<PlusIcon width={12} height={12} className="text-zinc-500" />
				</div>
				<div>
					<h5 className="font-semibold text-zinc-400 group-hover:text-zinc-200">
						Add a new channel
					</h5>
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
							<Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900">
								<div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
									<div className="flex flex-col gap-2">
										<div className="flex items-center justify-between">
											<Dialog.Title
												as="h3"
												className="text-lg font-semibold leading-none text-white"
											>
												Create channel
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
											Channels are freedom square, everyone can speech freely,
											no one can stop you or deceive what to speech
										</Dialog.Description>
									</div>
								</div>
								<div className="flex h-full w-full flex-col overflow-y-auto px-5 pb-5 pt-3">
									<form
										onSubmit={handleSubmit(onSubmit)}
										className="flex h-full w-full flex-col gap-4"
									>
										<input
											type={"hidden"}
											{...register("picture")}
											value={image}
											className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
										/>
										<div className="flex flex-col gap-1">
											<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
												Picture
											</label>
											<div className="relative inline-flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950">
												<Image
													src={image}
													alt="channel picture"
													className="relative z-10 h-11 w-11 rounded-md"
												/>
												<div className="absolute bottom-3 right-3 z-10">
													<AvatarUploader valueState={setImage} />
												</div>
											</div>
										</div>
										<div className="flex flex-col gap-1">
											<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
												Channel name *
											</label>
											<div className="relative w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
												<input
													type={"text"}
													{...register("name", {
														required: true,
														minLength: 4,
													})}
													spellCheck={false}
													className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
												/>
											</div>
										</div>
										<div className="flex flex-col gap-1">
											<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
												Description
											</label>
											<div className="relative h-20 w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
												<textarea
													{...register("about")}
													spellCheck={false}
													className="relative h-20 w-full resize-none rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
												/>
											</div>
										</div>
										<div className="flex h-20 items-center justify-between gap-1 rounded-lg bg-zinc-800 px-4 py-2">
											<div className="flex flex-col gap-1">
												<span className="font-semibold leading-none text-white">
													Encrypted
												</span>
												<p className="w-4/5 text-sm leading-none text-zinc-400">
													All messages are encrypted and only invited members
													can view and send message
												</p>
											</div>
											<div>
												<button
													type="button"
													disabled
													className="relative inline-flex h-6 w-11 flex-shrink-0  rounded-full border-2 border-transparent bg-zinc-900 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-2"
													role="switch"
													aria-checked="false"
												>
													<span className="pointer-events-none inline-block h-5 w-5 translate-x-0 transform rounded-full bg-zinc-600 shadow ring-0 transition duration-200 ease-in-out" />
												</button>
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
													"Create channel"
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
