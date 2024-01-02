import { useColumnContext, useStorage } from "@lume/ark";
import { CancelIcon, CheckCircleIcon } from "@lume/icons";
import { User } from "@lume/ui";
import { useState } from "react";

export function GroupForm({ id }: { id: number }) {
	const storage = useStorage();
	const { updateColumn, removeColumn } = useColumnContext();

	const [title, setTitle] = useState<string>(`Group-${id}`);
	const [users, setUsers] = useState<Array<string>>([]);

	// toggle follow state
	const toggleUser = (pubkey: string) => {
		const arr = users.includes(pubkey)
			? users.filter((i) => i !== pubkey)
			: [...users, pubkey];
		setUsers(arr);
	};

	const submit = async () => {
		await updateColumn(id, title, JSON.stringify(users));
	};

	return (
		<div className="flex flex-col justify-between h-full">
			<div className="flex flex-col flex-1 min-h-0">
				<div className="flex items-center justify-between w-full px-3 border-b h-11 shrink-0 border-neutral-100 dark:border-neutral-900">
					<h1 className="text-sm font-semibold">Create a new Group</h1>
					<button
						type="button"
						onClick={async () => await removeColumn(id)}
						className="inline-flex items-center justify-center rounded size-6 hover:bg-neutral-100 dark:hover:bg-neutral-900"
					>
						<CancelIcon className="size-4" />
					</button>
				</div>
				<div className="flex flex-col gap-5 px-3 pt-2 overflow-y-auto">
					<div className="flex flex-col gap-1">
						<label
							htmlFor="name"
							className="font-medium text-neutral-700 dark:text-neutral-300"
						>
							Group Name
						</label>
						<input
							name="name"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Nostrichs..."
							className="px-3 rounded-lg border-neutral-200 dark:border-neutral-900 h-11 placeholder:text-neutral-500 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<div className="inline-flex items-center justify-between">
							<span className="font-medium text-neutral-700 dark:text-neutral-300">
								Pick user
							</span>
							<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{`${users.length} / ∞`}</span>
						</div>
						<div className="flex flex-col gap-2">
							{storage.account?.contacts?.map((item: string) => (
								<button
									key={item}
									type="button"
									onClick={() => toggleUser(item)}
									className="inline-flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900"
								>
									<User pubkey={item} variant="simple" />
									{users.includes(item) ? (
										<CheckCircleIcon className="w-5 h-5 text-teal-500" />
									) : null}
								</button>
							))}
							<div className="h-20" />
						</div>
					</div>
				</div>
			</div>
			<div className="absolute z-10 flex items-center justify-center w-full bottom-3">
				<button
					type="button"
					onClick={submit}
					disabled={users.length < 1}
					className="inline-flex items-center justify-center gap-2 px-6 font-medium text-white transform bg-blue-500 rounded-full active:translate-y-1 w-36 h-11 hover:bg-blue-600 focus:outline-none disabled:cursor-not-allowed"
				>
					Create
				</button>
			</div>
		</div>
	);
}
