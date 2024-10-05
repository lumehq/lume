import { commands } from "@/commands.gen";
import { Spinner } from "@/components";
import { User } from "@/components/user";
import { Plus, X } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState, useTransition } from "react";

export const Route = createLazyFileRoute("/columns/_layout/create-group")({
	component: Screen,
});

const REYA_NPUB =
	"npub1zfss807aer0j26mwp2la0ume0jqde3823rmu97ra6sgyyg956e0s6xw445";

function Screen() {
	const contacts = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { queryClient } = Route.useRouteContext();

	const [title, setTitle] = useState("");
	const [npub, setNpub] = useState("");
	const [users, setUsers] = useState<string[]>([REYA_NPUB]);
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
			const key = `lume_v4:group:${search.label}`;
			const res = await commands.setLumeStore(key, JSON.stringify(users));

			if (res.status === "ok") {
				await queryClient.invalidateQueries({
					queryKey: [search.label, search.account],
				});
				// @ts-ignore, tanstack router bug.
				navigate({ to: search.redirect, search: { ...search, name: title } });
			} else {
				await message(res.error, {
					title: "Create Group",
					kind: "error",
				});
				return;
			}
		});
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-4">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="font-serif text-2xl font-medium">Create a group</h1>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					For the people that you want to keep up.
				</p>
			</div>
			<div className="flex flex-col w-4/5 max-w-full gap-3">
				<div className="flex items-center w-full rounded-lg h-9 shrink-0 bg-neutral-200 dark:bg-neutral-800">
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
						placeholder="Enter a name for this group"
						className="h-full px-3 text-sm bg-transparent border-none placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="flex flex-col items-center w-full gap-3">
					<div className="overflow-y-auto scrollbar-none p-2 w-full h-[450px] flex flex-col gap-3 bg-neutral-200 dark:bg-neutral-900 rounded-xl">
						<div className="flex gap-2">
							<input
								name="npub"
								value={npub}
								onChange={(e) => setNpub(e.target.value)}
								placeholder="npub1..."
								className="w-full px-3 text-sm border-none rounded-lg h-9 bg-neutral-300 dark:bg-neutral-700 placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
							/>
							<button
								type="button"
								onClick={() => addUser()}
								className="inline-flex items-center justify-center text-neutral-500 rounded-lg size-9 bg-neutral-300 dark:bg-neutral-700 shrink-0 hover:bg-blue-500 hover:text-white"
							>
								<Plus className="size-5" />
							</button>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-sm font-semibold">Added</span>
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
									<div className="flex items-center justify-center text-sm rounded-lg bg-neutral-300 dark:bg-neutral-700 h-14">
										Empty.
									</div>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-sm font-semibold">Contacts</span>
							<div className="flex flex-col gap-2">
								{contacts.length ? (
									contacts.map((item: string) => (
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
					</div>
					<button
						type="button"
						onClick={() => submit()}
						disabled={isPending || users.length < 1}
						className="inline-flex items-center justify-center text-sm font-medium text-white bg-blue-500 rounded-full w-36 h-9 hover:bg-blue-600 disabled:opacity-50"
					>
						{isPending ? <Spinner /> : "Confirm"}
					</button>
				</div>
			</div>
		</div>
	);
}
