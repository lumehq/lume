import { createBlock } from "@libs/storage";
import { Kind1 } from "@shared/notes/contents/kind1";
import { Kind1063 } from "@shared/notes/contents/kind1063";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { User } from "@shared/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEvent } from "@utils/hooks/useEvent";
import { memo } from "react";

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
	const queryClient = useQueryClient();
	const { status, data } = useEvent(id);

	const block = useMutation({
		mutationFn: (data: any) => {
			return createBlock(data.kind, data.title, data.content);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	const openThread = (event: any, thread: string) => {
		const selection = window.getSelection();
		if (selection.toString().length === 0) {
			block.mutate({ kind: 2, title: "Thread", content: thread });
		} else {
			event.stopPropagation();
		}
	};

	return (
		<div
			onClick={(e) => openThread(e, id)}
			onKeyDown={(e) => openThread(e, id)}
			className="mt-3 rounded-lg bg-zinc-800/50 border-t border-zinc-700/50 px-3 py-3"
		>
			{status === "loading" ? (
				<NoteSkeleton />
			) : status === "success" ? (
				<>
					<User pubkey={data.pubkey} time={data.created_at} size="small" />
					<div className="mt-2">
						{data.kind === 1 && (
							<Kind1 content={data.content} truncate={true} />
						)}
						{data.kind === 1063 && <Kind1063 metadata={data.tags} />}
						{data.kind !== 1 && data.kind !== 1063 && (
							<div className="flex flex-col gap-2">
								<div className="px-2 py-2 inline-flex flex-col gap-1 bg-zinc-800 rounded-md">
									<span className="text-zinc-500 text-sm font-medium leading-none">
										Kind: {data.kind}
									</span>
									<p className="text-fuchsia-500 text-sm leading-none">
										Lume isn't fully support this kind in newsfeed
									</p>
								</div>
								<div className="select-text whitespace-pre-line	break-words text-base text-zinc-100">
									<p>{data.content}</p>
								</div>
							</div>
						)}
					</div>
				</>
			) : (
				<p>Failed to fetch event</p>
			)}
		</div>
	);
});
