import { useColumnContext } from "@lume/ark";
import { CancelIcon, PlusIcon } from "@lume/icons";
import { useState } from "react";
import { toast } from "sonner";

export function AntenasForm({ id }: { id: number }) {
	const { updateColumn, removeColumn } = useColumnContext();

	const [title, setTitle] = useState<string>(`Antena-${id}`);
	const [source, setSource] = useState("contacts");
	const [hashtag, setHashtag] = useState("");
	const [hashtags, setHashtags] = useState<string[]>([]);

	const addHashtag = () => {
		if (!hashtag.startsWith("#"))
			return toast.error("Hashtag need to start with #");
		if (hashtag.length > 64) return toast.error("Hashtag too long");
		setHashtags((prev) => [...prev, hashtag]);
		setHashtag("");
	};

	const removeHashtag = (item: string) => {
		setHashtags((prev) => prev.filter((tag) => tag !== item));
	};

	const submit = async () => {
		const content = {
			hashtags,
			source,
		};
		await updateColumn(id, title, JSON.stringify(content));
	};

	return (
		<div className="flex flex-col justify-between h-full">
			<div className="flex flex-col flex-1 min-h-0">
				<div className="flex items-center justify-between w-full px-3 border-b h-11 shrink-0 border-neutral-100 dark:border-neutral-900">
					<h1 className="text-sm font-semibold">Create a new Antena</h1>
					<button
						type="button"
						onClick={async () => await removeColumn(id)}
						className="inline-flex items-center justify-center rounded size-6 hover:bg-neutral-100 dark:hover:bg-neutral-900"
					>
						<CancelIcon className="size-4" />
					</button>
				</div>
				<div className="flex flex-col h-full gap-5 px-3 pt-2 overflow-y-auto">
					<div className="flex flex-col gap-1">
						<label htmlFor="name" className="font-medium">
							Name
						</label>
						<input
							type="text"
							name="name"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Nostrichs..."
							className="px-2 border border-neutral-100 dark:border-neutral-900 bg-neutral-50 rounded-lg h-10 dark:bg-neutral-950 placeholder:text-neutral-600 focus:border-blue-500 focus:shadow-none focus:ring-0"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="source"
							className="select-none text-neutral-950 data-[disabled]:opacity-50 font-medium mb-1 dark:text-white"
						>
							Source
						</label>
						<select
							name="source"
							value={source}
							onChange={(e) => setSource(e.target.value)}
							className="px-2 w-full border border-neutral-100 dark:border-neutral-900 bg-neutral-50 rounded-lg dark:bg-neutral-950 placeholder:text-neutral-600 focus:border-blue-500 focus:shadow-none focus:ring-0"
						>
							<option value="contacts">Contacts</option>
							<option value="global">Global</option>
						</select>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="name"
							className="select-none text-neutral-950 data-[disabled]:opacity-50 font-medium mb-1 dark:text-white"
						>
							Hashtags to listen to
						</label>
						<div className="flex items-center justify-between gap-2 mb-1">
							<input
								name="name"
								value={hashtag}
								onChange={(e) => setHashtag(e.target.value)}
								onKeyPress={(event) => {
									if (event.key === "Enter") addHashtag();
								}}
								placeholder="#nostr..."
								className="px-2 w-full border border-neutral-100 dark:border-neutral-900 bg-neutral-50 rounded-lg h-10 dark:bg-neutral-950 placeholder:text-neutral-600 focus:border-blue-500 focus:shadow-none focus:ring-0"
							/>
							<button
								type="button"
								onClick={() => addHashtag()}
								className="inline-flex items-center justify-center h-full text-white bg-blue-500 rounded-lg aspect-square shrink-0 hover:bg-blue-600"
							>
								<PlusIcon className="size-4" />
							</button>
						</div>
						<div className="flex flex-wrap items-center justify-start gap-2">
							{hashtags.map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => removeHashtag(item)}
									className="inline-flex items-center justify-center h-6 px-2 text-sm rounded-md w-min bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
								>
									{item}
								</button>
							))}
						</div>
					</div>
					<div>
						<button
							type="button"
							onClick={submit}
							disabled={hashtags.length < 1}
							className="w-full inline-flex items-center justify-center h-10 px-4 font-semibold text-white transform bg-blue-500 rounded-lg active:translate-y-1 hover:bg-blue-600 focus:outline-none disabled:opacity-50"
						>
							Create
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
