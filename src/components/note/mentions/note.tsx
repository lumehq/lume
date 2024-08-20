import { Spinner } from "@/components";
import { User } from "@/components/user";
import { LumeWindow, useEvent } from "@/system";
import { Link } from "@phosphor-icons/react";

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
			<div className="py-2">
				<div className="pl-4 py-3 flex flex-col w-full border-l-2 border-black/5 dark:border-white/5">
					<Spinner className="size-5" />
				</div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="py-2">
				<div className="pl-4 py-3 flex flex-col w-full border-l-2 border-black/5 dark:border-white/5">
					<p className="text-sm font-medium text-red-500">
						Event not found with your current relay set
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-2">
			<div className="pl-4 py-3 flex flex-col w-full border-l-2 border-black/5 dark:border-white/5">
				<User.Provider pubkey={data.pubkey}>
					<User.Root className="flex items-center gap-2 h-8">
						<User.Avatar className="rounded-full size-6" />
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
				<div className="select-text text-pretty line-clamp-3 content-break leading-normal">
					{data.content}
				</div>
				{openable ? (
					<div className="flex items-center justify-start mt-3">
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								LumeWindow.openEvent(data);
							}}
							className="inline-flex items-center gap-1 text-blue-500 text-sm"
						>
							View post
							<Link className="size-3" />
						</button>
					</div>
				) : (
					<div className="h-3" />
				)}
			</div>
		</div>
	);
}
