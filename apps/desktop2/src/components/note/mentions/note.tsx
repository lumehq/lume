import { LumeWindow, useEvent } from "@lume/system";
import { LinkIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { User } from "@/components/user";
import { Spinner } from "@lume/ui";

export function MentionNote({
	eventId,
	openable = true,
}: {
	eventId: string;
	openable?: boolean;
}) {
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-20 mt-2 border rounded-xl border-black/10 dark:border-white/10">
				<Spinner className="size-5" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="w-full p-3 mt-2 border rounded-xl border-black/10 dark:border-white/10">
				Event not found with your current relay set
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full border rounded-lg cursor-default border-black/10 dark:border-white/10">
			<User.Provider pubkey={data.pubkey}>
				<User.Root className="flex items-center gap-2 px-3 h-11">
					<User.Avatar className="object-cover rounded-full size-6 shrink-0" />
					<div className="inline-flex items-center flex-1 gap-2">
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
					"px-3 select-text whitespace-normal text-pretty content-break leading-normal",
					data.content.length > 400 ? "max-h-[150px] gradient-mask-b-0" : "",
				)}
			>
				{data.content}
			</div>
			{openable ? (
				<div className="flex items-center justify-end px-2 h-11">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							LumeWindow.openEvent(data);
						}}
						className="z-10 inline-flex items-center justify-center gap-1 text-sm rounded-full h-7 w-28 bg-black/10 dark:bg-white/10 text-neutral-600 hover:text-blue-500 dark:text-neutral-400"
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
