import { commands } from "@/commands.gen";
import { Spinner } from "@/components";
import { User } from "@/components/user";
import { Plus, X } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { useState, useTransition } from "react";

export const Route = createLazyFileRoute("/$id/set-group")({
	component: Screen,
});

function Screen() {
	const contacts = Route.useLoaderData();
	const { id } = Route.useParams();
	const { queryClient } = Route.useRouteContext();

	const [title, setTitle] = useState("");
	const [npub, setNpub] = useState("");
	const [users, setUsers] = useState<string[]>([]);
	const [isPending, startTransition] = useTransition();

	const toggleUser = (pubkey: string) => {
		setUsers((prev) =>
			prev.includes(pubkey)
				? prev.filter((i) => i !== pubkey)
				: [...prev, pubkey],
		);
	};

	const addUser = () => {
		if (!npub.startsWith("npub1")) return;
		if (users.includes(npub)) return;

		setUsers((prev) => [...prev, npub]);
		setNpub("");
	};

	const submit = () => {
		startTransition(async () => {
			const signer = await commands.hasSigner(id);

			if (signer.status === "ok") {
				if (!signer.data) {
					const res = await commands.setSigner(id);

					if (res.status === "error") {
						await message(res.error, { kind: "error" });
						return;
					}
				}
			} else {
				await message(signer.error, { kind: "error" });
				return;
			}

			const res = await commands.setGroup(title, null, null, users);

			if (res.status === "ok") {
				const window = getCurrentWindow();

				// Invalidate cache
				await queryClient.invalidateQueries({
					queryKey: ["others", "newsfeeds", id],
				});

				// Create column in the main window
				await window.emitTo("main", "columns", {
					type: "add",
					column: {
						label: res.data,
						name: title,
						account: id,
						url: `/columns/groups/${res.data}`,
					},
				});

				// Close current popup
				await window.close();
			} else {
				await message(res.error, { kind: "error" });
				return;
			}
		});
	};

	return (
		<div className="flex flex-col size-full">
			<div data-tauri-drag-region className="shrink-0 h-11" />
			<div className="shrink-0 h-14 px-3 flex items-center gap-2 justify-between border-b border-black/5 dark:border-white/5">
				<div className="flex items-center flex-1 rounded-lg h-9 shrink-0 bg-black/10 dark:bg-white/10">
					<label
						htmlFor="name"
						className="w-16 text-sm font-semibold text-center border-r border-neutral-300 dark:border-neutral-700 shrink-0"
					>
						Name
					</label>
					<input
						name="name"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="family, bff, devs,..."
						className="h-full px-3 text-sm bg-transparent border-none placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
					/>
				</div>
				<button
					type="button"
					onClick={() => submit()}
					disabled={isPending || users.length < 1}
					className="shrink-0 inline-flex items-center justify-center text-sm font-medium text-white bg-blue-500 rounded-lg w-20 h-9 hover:bg-blue-600 disabled:opacity-50"
				>
					{isPending ? <Spinner /> : "Create"}
				</button>
			</div>
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="flex-1 overflow-hidden"
			>
				<ScrollArea.Viewport className="bg-white dark:bg-black h-full p-3">
					<div className="mb-3 flex flex-col gap-2">
						<h3 className="text-sm font-semibold">Added</h3>
						<div className="flex gap-2">
							<input
								name="npub"
								value={npub}
								onChange={(e) => setNpub(e.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") addUser();
								}}
								placeholder="npub1..."
								className="w-full px-3 text-sm border-none rounded-lg h-9 bg-neutral-100 dark:bg-neutral-900 placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
							/>
							<button
								type="button"
								onClick={() => addUser()}
								className="inline-flex items-center justify-center text-neutral-500 rounded-lg size-9 bg-neutral-200 dark:bg-neutral-800 shrink-0 hover:bg-blue-500 hover:text-white"
							>
								<Plus className="size-5" />
							</button>
						</div>
						<div className="flex flex-col gap-2">
							{users.length ? (
								users.map((item: string) => (
									<button
										key={item}
										type="button"
										onClick={() => toggleUser(item)}
										className="inline-flex items-center justify-between px-3 py-2 bg-white rounded-lg dark:bg-black/20 shadow-primary dark:ring-1 ring-neutral-800/50"
									>
										<User.Provider pubkey={item}>
											<User.Root className="flex items-center gap-2.5">
												<User.Avatar className="rounded-full size-8" />
												<div className="flex items-center gap-1">
													<User.Name className="text-sm font-medium" />
												</div>
											</User.Root>
										</User.Provider>
										<X className="size-4" />
									</button>
								))
							) : (
								<div className="flex items-center justify-center text-sm rounded-lg bg-neutral-100 dark:bg-neutral-900 h-14">
									Please add some user to your group.
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="text-sm font-semibold">Contacts</h3>
						<div className="flex flex-col gap-2">
							{contacts.length ? (
								contacts
									.filter((c) => !users.includes(c))
									.map((item: string) => (
										<button
											key={item}
											type="button"
											onClick={() => toggleUser(item)}
											className="inline-flex items-center justify-between px-3 py-2 rounded-lg border-[.5px] border-neutral-300 dark:border-neutral-700 hover:border-blue-500"
										>
											<User.Provider pubkey={item}>
												<User.Root className="flex items-center gap-2.5">
													<User.Avatar className="rounded-full size-8" />
													<div className="flex items-center gap-1">
														<User.Name className="text-sm font-medium" />
													</div>
												</User.Root>
											</User.Provider>
										</button>
									))
							) : (
								<div className="flex items-center justify-center text-sm rounded-lg bg-black/5 dark:bg-white/5 h-14">
									<p>
										Find more user at{" "}
										<a
											href="https://www.nostr.directory/"
											target="_blank"
											className="text-blue-600 after:content-['_↗']"
											rel="noreferrer"
										>
											Nostr Directory
										</a>
									</p>
								</div>
							)}
						</div>
					</div>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
					orientation="vertical"
				>
					<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className="bg-transparent" />
			</ScrollArea.Root>
		</div>
	);
}
