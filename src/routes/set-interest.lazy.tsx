import { commands } from "@/commands.gen";
import { cn } from "@/commons";
import { Spinner } from "@/components";
import { Plus, X } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "@tauri-apps/plugin-dialog";
import { useState, useTransition } from "react";

const TOPICS = [
	{
		title: "Popular hashtags",
		content: [
			"#nostr",
			"#introductions",
			"#grownostr",
			"#zap",
			"#meme",
			"#asknostr",
			"#bitcoin",
		],
	},
];

export const Route = createLazyFileRoute("/set-interest")({
	component: Screen,
});

function Screen() {
	const [title, setTitle] = useState("");
	const [hashtag, setHashtag] = useState("");
	const [hashtags, setHashtags] = useState<string[]>([]);
	const [isPending, startTransition] = useTransition();

	const { account } = Route.useSearch();
	const { queryClient } = Route.useRouteContext();

	const toggleHashtag = (tag: string) => {
		setHashtags((prev) =>
			prev.includes(tag) ? prev.filter((i) => i !== tag) : [...prev, tag],
		);
	};

	const addHashtag = () => {
		if (!hashtag.startsWith("#")) return;
		if (hashtags.includes(hashtag)) return;

		setHashtags((prev) => [...prev, hashtag]);
		setHashtag("");
	};

	const submit = () => {
		startTransition(async () => {
			const content = hashtags.map((tag) =>
				tag.toLowerCase().replace(" ", "-").replace("#", ""),
			);
			const res = await commands.setInterest(title, null, null, content);

			if (res.status === "ok") {
				const window = getCurrentWindow();

				// Invalidate cache
				await queryClient.invalidateQueries({
					queryKey: ["myinterests", account],
				});

				// Create column in the main window
				await window.emitTo("main", "columns", {
					type: "add",
					column: {
						label: res.data,
						name: title,
						url: `/columns/interests/${res.data}`,
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
						placeholder="anime, sport, art,..."
						className="h-full px-3 text-sm bg-transparent border-none placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
					/>
				</div>
				<button
					type="button"
					onClick={() => submit()}
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
						<span className="text-sm font-semibold">Added</span>
						<div className="flex gap-2">
							<input
								name="hashtag"
								placeholder="#nostr"
								onChange={(e) => setHashtag(e.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") addHashtag();
								}}
								className="w-full px-3 text-sm border-none rounded-lg h-9 bg-neutral-100 dark:bg-neutral-900 placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
							/>
							<button
								type="button"
								onClick={() => addHashtag()}
								className="inline-flex items-center justify-center text-neutral-500 rounded-lg size-9 bg-neutral-200 dark:bg-neutral-800 shrink-0 hover:bg-blue-500 hover:text-white"
							>
								<Plus className="size-5" />
							</button>
						</div>
						<div className="flex flex-col gap-2">
							{hashtags.length ? (
								hashtags.map((item: string) => (
									<button
										key={item}
										type="button"
										onClick={() => toggleHashtag(item)}
										className="inline-flex items-center justify-between p-3 bg-white rounded-lg dark:bg-black/20 shadow-primary dark:ring-1 ring-neutral-800/50"
									>
										<p>{item}</p>
										<X className="size-4" />
									</button>
								))
							) : (
								<div className="flex items-center justify-center text-sm rounded-lg bg-neutral-100 dark:bg-neutral-900 h-14">
									Please add some hashtag.
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-4">
						{TOPICS.map((topic) => (
							<div key={topic.title} className="flex flex-col gap-2">
								<div className="text-sm font-semibold">{topic.title}</div>
								<div className="flex flex-wrap gap-2">
									{topic.content.map((item) => (
										<button
											key={item}
											type="button"
											onClick={() => toggleHashtag(item)}
											className={cn(
												"text-sm p-2 rounded-full",
												hashtags.includes(item)
													? "bg-blue-500 text-white"
													: "bg-neutral-100 dark:bg-neutral-900",
											)}
										>
											{item}
										</button>
									))}
								</div>
							</div>
						))}
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
