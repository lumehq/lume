import { Spinner } from "@/components";
import { User } from "@/components/user";
import { NostrAccount, NostrQuery } from "@/system";
import type { ColumnRouteSearch } from "@/types";
import { Plus, X } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

export const Route = createFileRoute("/create-group")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	loader: async () => {
		const contacts = await NostrAccount.getContactList();
		return contacts;
	},
	component: Screen,
});

function Screen() {
	const [title, setTitle] = useState("");
	const [npub, setNpub] = useState("");
	const [users, setUsers] = useState<string[]>([
		"npub1zfss807aer0j26mwp2la0ume0jqde3823rmu97ra6sgyyg956e0s6xw445", // reya
	]);
	const [isLoading, setIsLoading] = useState(false);

	const contacts = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

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

	const submit = async () => {
		try {
			setIsLoading(true);

			const key = `lume_group_${search.label}`;
			const createGroup = await NostrQuery.setNstore(
				key,
				JSON.stringify(users),
			);

			if (createGroup) {
				return navigate({ to: search.redirect, search: { ...search } });
			}
		} catch (e) {
			setIsLoading(false);
			await message(String(e), { title: "Create Group", kind: "error" });
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-4">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="font-serif text-2xl font-medium">
					Focus feeds for people you like
				</h1>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					Add some people for custom feeds.
				</p>
			</div>
			<div className="flex flex-col w-4/5 max-w-full gap-3">
				<div className="flex items-center w-full rounded-lg h-9 shrink-0 bg-black/5 dark:bg-white/5">
					<label
						htmlFor="name"
						className="w-16 text-sm font-semibold text-center border-r border-black/10 dark:border-white/10 shrink-0"
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
					<div className="overflow-y-auto scrollbar-none p-2 w-full h-[450px] flex flex-col gap-3 bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex gap-2">
							<input
								name="npub"
								value={npub}
								onChange={(e) => setNpub(e.target.value)}
								placeholder="npub1..."
								className="w-full px-3 text-sm border-none rounded-lg h-9 bg-black/10 dark:bg-white/10 placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
							/>
							<button
								type="button"
								onClick={() => addUser()}
								className="inline-flex items-center justify-center text-white rounded-lg size-9 bg-black/20 dark:bg-white/20 shrink-0 hover:bg-blue-500"
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
											<div>
												<X className="size-4" />
											</div>
										</button>
									))
								) : (
									<div className="flex items-center justify-center text-sm rounded-lg bg-black/5 dark:bg-white/5 h-14">
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
						disabled={isLoading || users.length < 1}
						className="inline-flex items-center justify-center text-sm font-medium text-white bg-blue-500 rounded-full w-36 h-9 hover:bg-blue-600 disabled:opacity-50"
					>
						{isLoading ? <Spinner /> : "Confirm"}
					</button>
				</div>
			</div>
		</div>
	);
}
