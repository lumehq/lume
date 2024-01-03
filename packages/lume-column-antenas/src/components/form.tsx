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
						<label
							htmlFor="name"
							className="select-none text-neutral-950 data-[disabled]:opacity-50 font-medium mb-1 dark:text-white"
						>
							Name
						</label>
						<span className="relative block w-full before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow dark:before:hidden after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500 has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-neutral-950/5 before:has-[[data-disabled]]:shadow-none before:has-[[data-invalid]]:shadow-red-500/10">
							<input
								name="name"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Nostrichs..."
								className="relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] focus:ring-0 text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white border border-neutral-950/10 data-[hover]:border-neutral-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-transparent dark:bg-white/5 focus:outline-none data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500 data-[disabled]:border-neutral-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]"
							/>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="source"
							className="select-none text-neutral-950 data-[disabled]:opacity-50 font-medium mb-1 dark:text-white"
						>
							Source
						</label>
						<span className="relative block w-full before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow dark:before:hidden after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500 has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-neutral-950/5 before:has-[[data-disabled]]:shadow-none before:has-[[data-invalid]]:shadow-red-500/10">
							<select
								name="source"
								value={source}
								onChange={(e) => setSource(e.target.value)}
								className="relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] focus:ring-0 text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white border border-neutral-950/10 data-[hover]:border-neutral-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-transparent dark:bg-white/5 focus:outline-none data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500 data-[disabled]:border-neutral-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]"
							>
								<option value="contacts">Contacts</option>
								<option value="global">Global</option>
							</select>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="name"
							className="select-none text-neutral-950 data-[disabled]:opacity-50 font-medium mb-1 dark:text-white"
						>
							Hashtags to listen to
						</label>
						<div className="flex items-center justify-between gap-2 mb-1">
							<span className="relative block flex-1 before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow dark:before:hidden after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500 has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-neutral-950/5 before:has-[[data-disabled]]:shadow-none before:has-[[data-invalid]]:shadow-red-500/10">
								<input
									name="name"
									value={hashtag}
									onChange={(e) => setHashtag(e.target.value)}
									onKeyPress={(event) => {
										if (event.key === "Enter") addHashtag();
									}}
									placeholder="#nostr..."
									className="relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] focus:ring-0 text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white border border-neutral-950/10 data-[hover]:border-neutral-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-transparent dark:bg-white/5 focus:outline-none data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500 data-[disabled]:border-neutral-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]"
								/>
							</span>
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
							className="inline-flex items-center justify-center h-10 px-4 font-semibold text-white transform bg-blue-500 rounded-lg active:translate-y-1 hover:bg-blue-600 focus:outline-none disabled:opacity-50"
						>
							Create
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
