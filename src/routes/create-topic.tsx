import { Spinner } from "@/components";
import { CheckCircleIcon } from "@/components";
import { TOPICS } from "@/constants";
import { NostrQuery } from "@/system";
import type { ColumnRouteSearch } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

type Topic = {
	title: string;
	content: string[];
};

export const Route = createFileRoute("/create-topic")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	component: Screen,
});

function Screen() {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const toggleTopic = (topic: Topic) => {
		setTopics((prev) =>
			prev.find((item) => item.title === topic.title)
				? prev.filter((i) => i.title !== topic.title)
				: [...prev, topic],
		);
	};

	const submit = async () => {
		try {
			setIsLoading(true);

			const key = `lume_topic_${search.label}`;
			const createTopic = await NostrQuery.setNstore(
				key,
				JSON.stringify(topics),
			);

			if (createTopic) {
				return navigate({ to: search.redirect, search: { ...search } });
			}
		} catch (e) {
			setIsLoading(false);
			await message(String(e), {
				title: "Create Topic",
				kind: "error",
			});
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-4">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="font-serif text-2xl font-medium">
					What are your interests?
				</h1>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					Add some topics you want to focus on.
				</p>
			</div>
			<div className="flex flex-col w-4/5 max-w-full gap-3">
				<div className="flex items-center justify-between w-full px-3 rounded-lg h-9 shrink-0 bg-black/5 dark:bg-white/5">
					<span className="text-sm font-medium">Added: {topics.length}</span>
				</div>
				<div className="flex flex-col items-center w-full gap-3">
					<div className="overflow-y-auto scrollbar-none p-2 w-full h-[450px] bg-black/5 dark:bg-white/5 rounded-xl">
						<div className="flex flex-col gap-3">
							{TOPICS.map((topic) => (
								<button
									key={topic.title}
									type="button"
									onClick={() => toggleTopic(topic)}
									className="flex items-center justify-between px-3 bg-white border border-transparent rounded-lg h-11 dark:bg-black/20 hover:border-blue-500 shadow-primary dark:ring-1 ring-neutral-800/50"
								>
									<div className="inline-flex items-center gap-1">
										<div>{topic.icon}</div>
										<div className="text-sm font-medium">
											<span>{topic.title}</span>
											<span className="ml-1 italic font-normal text-neutral-400 dark:text-neutral-600">
												{topic.content.length} hashtags
											</span>
										</div>
									</div>
									{topics.find((item) => item.title === topic.title) ? (
										<CheckCircleIcon className="text-teal-500 size-4" />
									) : null}
								</button>
							))}
						</div>
					</div>
					<button
						type="button"
						onClick={() => submit()}
						disabled={isLoading || topics.length < 1}
						className="inline-flex items-center justify-center text-sm font-medium text-white bg-blue-500 rounded-full w-36 h-9 hover:bg-blue-600 disabled:opacity-50"
					>
						{isLoading ? <Spinner /> : "Confirm"}
					</button>
				</div>
			</div>
		</div>
	);
}
