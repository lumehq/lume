import { Dialog, Transition } from "@headlessui/react";
import { createBlock } from "@libs/storage";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { CancelIcon, CommandIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { RelayContext } from "@shared/relayProvider";
import { DEFAULT_AVATAR } from "@stores/constants";
import { ADD_IMAGEBLOCK_SHORTCUT } from "@stores/shortcuts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { open } from "@tauri-apps/api/dialog";
import { Body, fetch } from "@tauri-apps/api/http";
import { createBlobFromFile } from "@utils/createBlobFromFile";
import { dateToUnix } from "@utils/date";
import { useAccount } from "@utils/hooks/useAccount";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";

export function AddImageBlock() {
	const ndk = useContext(RelayContext);
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState("");

	const { account } = useAccount();

	const tags = useRef(null);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	useHotkeys(ADD_IMAGEBLOCK_SHORTCUT, () => openModal());

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { isDirty, isValid },
	} = useForm();

	const openFileDialog = async () => {
		const selected: any = await open({
			multiple: false,
			filters: [
				{
					name: "Image",
					extensions: ["png", "jpeg", "jpg"],
				},
			],
		});

		if (Array.isArray(selected)) {
			// user selected multiple files
		} else if (selected === null) {
			// user cancelled the selection
		} else {
			const filename = selected.split("/").pop();
			const file = await createBlobFromFile(selected);
			const buf = await file.arrayBuffer();

			const res: any = await fetch("https://void.cat/upload?cli=false", {
				method: "POST",
				timeout: 5,
				headers: {
					accept: "*/*",
					"Content-Type": "application/octet-stream",
					"V-Filename": filename,
					"V-Description": "Upload from https://lume.nu",
					"V-Strip-Metadata": "true",
				},
				body: Body.bytes(buf),
			});

			if (res.ok) {
				const imageURL = `https://void.cat/d/${res.data.file.id}.webp`;
				tags.current = [
					["url", imageURL],
					["m", res.data.file.metadata.mimeType],
					["x", res.data.file.metadata.digest],
					["size", res.data.file.metadata.size],
					["magnet", res.data.file.metadata.magnetLink],
				];

				setImage(imageURL);
			}
		}
	};

	const block = useMutation({
		mutationFn: (data: any) => {
			return createBlock(data.kind, data.title, data.content);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	const onSubmit = (data: any) => {
		setLoading(true);

		const signer = new NDKPrivateKeySigner(account.privkey);
		ndk.signer = signer;

		const event = new NDKEvent(ndk);
		// build event
		event.content = data.title;
		event.kind = 1063;
		event.created_at = dateToUnix();
		event.pubkey = account.pubkey;
		event.tags = tags.current;

		// publish event
		event.publish();

		// mutate
		block.mutate({ kind: 0, title: data.title, content: data.content });

		setLoading(false);
		// reset form
		reset();
		// close modal
		closeModal();
	};

	useEffect(() => {
		setValue("content", image);
	}, [setValue, image]);

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
						<span className="text-zinc-500 text-sm leading-none">I</span>
					</div>
				</div>
				<div>
					<h5 className="font-medium text-zinc-400">New image block</h5>
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
										className="flex h-full w-full flex-col gap-4 mb-0"
									>
										<input
											type={"hidden"}
											{...register("content")}
											value={image}
											className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
										/>
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
													className="relative h-10 w-full rounded-md border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
												/>
											</div>
										</div>
										<div className="flex flex-col gap-1">
											<label className="text-sm font-medium uppercase tracking-wider text-zinc-400">
												Picture
											</label>
											<div className="relative inline-flex h-56 w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950">
												<Image
													src={image}
													fallback={DEFAULT_AVATAR}
													alt="content"
													className="relative z-10 max-h-[156px] h-auto w-[150px] object-cover rounded-md"
												/>
												<div className="absolute bottom-3 right-3 z-10">
													<button
														onClick={() => openFileDialog()}
														type="button"
														className="inline-flex h-6 items-center justify-center rounded bg-zinc-900 px-3 text-sm font-medium text-zinc-300 ring-1 ring-zinc-800 hover:bg-zinc-800"
													>
														Upload
													</button>
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
