import { useEvent } from "@lume/ark";
import { LinkIcon } from "@lume/icons";
import { useRouteContext } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@lume/utils";
import { User } from "@/components/user";

export function MentionNote({
	eventId,
	openable = true,
}: {
	eventId: string;
	openable?: boolean;
}) {
	const { ark } = useRouteContext({ strict: false });
	const { t } = useTranslation();
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div className="flex w-full cursor-default items-center justify-between rounded-xl border border-black/10 p-3 dark:border-white/10">
				<p>Loading...</p>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="w-full cursor-default rounded-xl border border-black/10 p-3 dark:border-white/10">
				{t("note.error")}
			</div>
		);
	}

	return (
		<div className="mt-2 flex w-full cursor-default flex-col rounded-xl border border-black/10 dark:border-white/10">
			<User.Provider pubkey={data.pubkey}>
				<User.Root className="flex h-12 items-center gap-2 px-3">
					<User.Avatar className="size-6 shrink-0 rounded-full object-cover" />
					<div className="inline-flex flex-1 items-center gap-2">
						<User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
						<span className="text-neutral-600 dark:text-neutral-400">·</span>
						<User.Time
							time={data.created_at}
							className="text-neutral-600 dark:text-neutral-400"
						/>
					</div>
				</User.Root>
			</User.Provider>
			<div
				className={cn(
					"px-3 select-text content-break whitespace-normal text-balance leading-normal",
					data.content.length > 100 ? "max-h-[150px] gradient-mask-b-0" : "",
				)}
			>
				{data.content}
			</div>
			{openable ? (
				<div className="flex h-14 items-center justify-end px-3">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							ark.open_event_id(data.id);
						}}
						className="z-10 h-7 w-28 inline-flex items-center justify-center gap-1 text-sm bg-neutral-100 dark:bg-white/10 rounded-full text-neutral-600 hover:text-blue-500 dark:text-neutral-400"
					>
						View post
						<LinkIcon className="size-4" />
					</button>
				</div>
			) : (
				<div className="h-3" />
			)}
		</div>
	);
}
