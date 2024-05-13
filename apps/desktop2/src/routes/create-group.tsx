import { CheckCircleIcon } from "@lume/icons";
import type { ColumnRouteSearch } from "@lume/types";
import { Spinner } from "@lume/ui";
import { User } from "@/components/user";
import { createFileRoute, useRouter } from "@tanstack/react-router";
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
	const contacts = Route.useLoaderData();
	const router = useRouter();

	const { ark } = Route.useRouteContext();
	const { label, redirect } = Route.useSearch();

	const [title, setTitle] = useState<string>("Just a new group");
	const [users, setUsers] = useState<Array<string>>([]);
	const [loading, setLoading] = useState(false);
	const [isDone, setIsDone] = useState(false);

	const toggleUser = (pubkey: string) => {
		const arr = users.includes(pubkey)
			? users.filter((i) => i !== pubkey)
			: [...users, pubkey];
		setUsers(arr);
	};

	const submit = async () => {
		try {
			if (isDone) return router.history.push(redirect);

			// start loading
			setLoading(true);

			const groups = await ark.set_nstore(
				`lume_group_${label}`,
				JSON.stringify(users),
			);

			if (groups) {
				toast.success("Group has been created successfully.");
				// start loading
				setIsDone(true);
				setLoading(false);
			}
		} catch (e) {
			setLoading(false);
			toast.error(e);
		}
	};

	return (
		<div className="h-full overflow-y-auto scrollbar-none">
			<div className="flex flex-col gap-5 p-3">
				<div className="flex flex-col gap-1">
					<label htmlFor="name" className="font-medium">
						Name
					</label>
					<input
						name="name"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Nostrichs..."
						className="h-10 rounded-lg bg-transparent border border-neutral-300 dark:border-neutral-700 px-3 placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<div className="inline-flex items-center justify-between">
						<span className="font-medium">Pick user</span>
						<span className="text-neutral-600 dark:text-neutral-400">{`${users.length} / ∞`}</span>
					</div>
					<div className="flex flex-col gap-2">
						{contacts.map((item: string) => (
							<button
								key={item}
								type="button"
								onClick={() => toggleUser(item)}
								className="inline-flex items-center justify-between px-3 py-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20"
							>
								<User.Provider pubkey={item}>
									<User.Root className="flex items-center gap-2.5">
										<User.Avatar className="size-10 rounded-full object-cover" />
										<div className="flex items-center gap-1">
											<User.Name className="font-medium" />
											<User.NIP05 />
										</div>
									</User.Root>
								</User.Provider>
								{users.includes(item) ? (
									<CheckCircleIcon className="size-5 text-teal-500" />
								) : null}
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="fixed z-10 flex items-center justify-center w-full bottom-6">
				{users.length >= 1 ? (
					<button
						type="button"
						onClick={() => submit()}
						disabled={users.length < 1}
						className="inline-flex items-center justify-center px-4 font-medium text-white transform bg-blue-500 rounded-full active:translate-y-1 w-32 h-10 hover:bg-blue-600 focus:outline-none"
					>
						{isDone ? "Back" : loading ? <Spinner /> : "Update"}
					</button>
				) : null}
			</div>
		</div>
	);
}
