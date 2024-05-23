import { CancelIcon, CheckCircleIcon, PlusIcon } from "@lume/icons";
import type { ColumnRouteSearch } from "@lume/types";
import { Spinner } from "@lume/ui";
import { User } from "@/components/user";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/create-group")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	loader: async ({ context }) => {
		const ark = context.ark;
		const contacts = await ark.get_contact_list();
		return contacts;
	},
	component: Screen,
});

function Screen() {
	const { ark } = Route.useRouteContext();

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
			const createGroup = await ark.set_nstore(key, JSON.stringify(users));

			if (createGroup) {
				return navigate({ to: search.redirect, search: { ...search } });
			}
		} catch (e) {
			setIsLoading(false);
			toast.error(e);
		}
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-4">
			<div className="text-center flex flex-col items-center justify-center">
				<h1 className="text-2xl font-serif font-medium">
					Focus feeds for people you like
				</h1>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					Add some people for custom feeds.
				</p>
			</div>
			<div className="w-4/5 max-w-full flex flex-col gap-3">
				<div className="w-full h-9 shrink-0 flex items-center bg-black/5 dark:bg-white/5 rounded-lg">
					<label
						htmlFor="name"
						className="w-16 border-r border-black/10 dark:border-white/10 shrink-0 text-center text-sm font-semibold"
					>
						Name
					</label>
					<input
						name="name"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Enter a name for this group"
						className="h-full bg-transparent border-none text-sm px-3 placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="w-full flex flex-col items-center gap-3">
					<div className="overflow-y-auto scrollbar-none p-2 w-full h-[450px] flex flex-col gap-3 bg-black/5 dark:bg-white/5 backdrop-blur-lg rounded-xl">
						<div className="flex gap-2">
							<input
								name="npub"
								value={npub}
								onChange={(e) => setNpub(e.target.value)}
								placeholder="npub1..."
								className="h-9 w-full rounded-lg bg-black/10 dark:bg-white/10 border-none text-sm px-3 placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
							/>
							<button
								type="button"
								onClick={() => addUser()}
								className="inline-flex size-9 rounded-lg items-center justify-center bg-black/20 dark:bg-white/20 shrink-0 text-white hover:bg-blue-500"
							>
								<PlusIcon className="size-6" />
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
											className="inline-flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-black/20 backdrop-blur-lg shadow-primary dark:ring-1 ring-neutral-800/50"
										>
											<User.Provider pubkey={item}>
												<User.Root className="flex items-center gap-2.5">
													<User.Avatar className="size-8 rounded-full object-cover" />
													<div className="flex items-center gap-1">
														<User.Name className="text-sm font-medium" />
													</div>
												</User.Root>
											</User.Provider>
											<div>
												<CancelIcon className="size-4" />
											</div>
										</button>
									))
								) : (
									<div className="bg-black/5 dark:bg-white/5 text-sm flex items-center justify-center h-14 rounded-lg">
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
											className="inline-flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-black/20 backdrop-blur-lg shadow-primary dark:ring-1 ring-neutral-800/50"
										>
											<User.Provider pubkey={item}>
												<User.Root className="flex items-center gap-2.5">
													<User.Avatar className="size-8 rounded-full object-cover" />
													<div className="flex items-center gap-1">
														<User.Name className="text-sm font-medium" />
													</div>
												</User.Root>
											</User.Provider>
										</button>
									))
								) : (
									<div className="bg-black/5 dark:bg-white/5 text-sm flex items-center justify-center h-14 rounded-lg">
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
						className="inline-flex items-center justify-center w-36 rounded-full h-9 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
					>
						{isLoading ? <Spinner /> : "Confirm"}
					</button>
				</div>
			</div>
		</div>
	);
}
