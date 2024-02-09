import { ArrowLeftIcon, EditInterestIcon, LoaderIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { TOPICS, cn } from "@lume/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function InterestModal({
	queryKey,
	className,
	children,
}: { queryKey: string[]; className?: string; children?: ReactNode }) {
	const storage = useStorage();
	const queryClient = useQueryClient();

	const [t] = useTranslation();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [hashtags, setHashtags] = useState(storage.interests?.hashtags || []);

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

			const save = await storage.createSetting(
				"interests",
				JSON.stringify({ hashtags }),
			);

			if (save) {
				storage.interests = { hashtags, users: [], words: [] };
				await queryClient.refetchQueries({ queryKey });
			}

			setLoading(false);
			setOpen(false);
		} catch (e) {
			setLoading(false);
			toast.error(String(e));
		}
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				className={cn(
					"inline-flex items-center gap-3 px-3 rounded-lg h-9 focus:outline-none",
					className,
				)}
			>
				{children ? (
					children
				) : (
					<>
						<EditInterestIcon className="size-4" />
						{t("interests.edit")}
					</>
				)}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm dark:bg-white/10" />
				<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center min-h-full">
					<div
						data-tauri-drag-region
						className="h-20 absolute top-0 left-0 w-full"
					/>
					<div className="relative w-full max-w-xl xl:max-w-2xl bg-white h-[600px] xl:h-[700px] rounded-xl dark:bg-black overflow-hidden">
						<div className="w-full h-full flex flex-col">
							<div className="h-16 shrink-0 px-8 border-b border-neutral-100 dark:border-neutral-900 flex w-full items-center justify-between">
								<div className="flex flex-col">
									<h3 className="font-semibold">{t("interests.edit")}</h3>
								</div>
							</div>
							<div className="w-full flex-1 min-h-0 flex flex-col justify-between">
								<div className="flex-1 min-h-0 overflow-y-auto px-8 py-8">
									<div className="flex flex-col gap-8">
										{TOPICS.map((topic) => (
											<div key={topic.title} className="flex flex-col gap-4">
												<div className="w-full flex items-center justify-between">
													<div className="inline-flex items-center gap-2.5">
														<img
															src={topic.icon}
															alt={topic.title}
															className="size-8 object-cover rounded-lg"
														/>
														<h3 className="text-lg font-semibold">
															{topic.title}
														</h3>
													</div>
													<button
														type="button"
														onClick={() => toggleAll(topic.content)}
														className="text-sm font-medium text-blue-500"
													>
														{t("interests.followAll")}
													</button>
												</div>
												<div className="flex flex-wrap items-center gap-3">
													{topic.content.map((hashtag) => (
														<button
															key={hashtag}
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
									<Dialog.Close className="inline-flex h-9 flex-1 gap-2 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-medium dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-blue-200">
										<ArrowLeftIcon className="size-4" />
										{t("global.cancel")}
									</Dialog.Close>
									<button
										type="button"
										onClick={submit}
										className="inline-flex h-9 flex-1 shrink-0 items-center justify-center rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
									>
										{loading ? (
											<LoaderIcon className="size-4 animate-spin" />
										) : (
											t("global.save")
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
