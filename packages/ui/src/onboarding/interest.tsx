import { ArrowLeftIcon, LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { TOPICS, cn } from "@lume/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function OnboardingInterestScreen() {
	const storage = useStorage();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [hashtags, setHashtags] = useState([]);

	const toggleHashtag = (item: string) => {
		const arr = hashtags.includes(item)
			? hashtags.filter((i) => i !== item)
			: [...hashtags, item];
		setHashtags(arr);
	};

	const toggleAll = (item: string[]) => {
		const sets = new Set([...hashtags, ...item]);
		setHashtags([...sets]);
	};

	const submit = async () => {
		try {
			setLoading(true);

			if (!hashtags.length) return navigate("/finish");

			const save = await storage.createSetting(
				"interests",
				JSON.stringify({ hashtags }),
			);

			setLoading(false);

			if (save) return navigate("/finish");
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="h-16 shrink-0 px-8 border-b border-neutral-100 dark:border-neutral-900 flex w-full items-center justify-between">
				<div className="flex flex-col">
					<h3 className="font-semibold">Interests</h3>
					<p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
						Pick things you'd like to see in your home feed.
					</p>
				</div>
			</div>
			<div className="w-full flex-1 min-h-0 flex flex-col justify-between">
				<div className="flex-1 min-h-0 overflow-y-auto px-8 py-8">
					<div className="flex flex-col gap-8">
						{TOPICS.map((topic, index) => (
							<div key={topic.title + index} className="flex flex-col gap-4">
								<div className="w-full flex items-center justify-between">
									<div className="inline-flex items-center gap-2.5">
										<img
											src={topic.icon}
											alt={topic.title}
											className="size-8 object-cover rounded-lg"
										/>
										<h3 className="text-lg font-semibold">{topic.title}</h3>
									</div>
									<button
										type="button"
										onClick={() => toggleAll(topic.content)}
										className="text-sm font-medium text-blue-500"
									>
										Follow All
									</button>
								</div>
								<div className="flex flex-wrap items-center gap-3">
									{topic.content.map((hashtag) => (
										<button
											type="button"
											onClick={() => toggleHashtag(hashtag)}
											className={cn(
												"inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-900 border border-transparent px-2 py-1 text-sm font-medium",
												hashtags.includes(hashtag)
													? "border-blue-500 text-blue-500"
													: "",
											)}
										>
											{hashtag}
										</button>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="h-16 shrink-0 w-full flex items-center px-8 justify-center gap-2 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="inline-flex h-9 flex-1 gap-2 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-medium dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-blue-200"
					>
						<ArrowLeftIcon className="size-4" />
						Back
					</button>
					<button
						type="button"
						onClick={submit}
						className="inline-flex h-9 flex-1 shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? (
							<LoaderIcon className="size-4 animate-spin" />
						) : (
							"Continue"
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
