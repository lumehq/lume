import { Kind1 } from "@shared/notes/kind1";
import { Kind1063 } from "@shared/notes/kind1063";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { User } from "@shared/user";
import { useEvent } from "@utils/hooks/useEvent";
import { parser } from "@utils/parser";
import { memo } from "react";

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
	const data = useEvent(id);

	const kind1 = data?.kind === 1 ? parser(data) : null;
	const kind1063 = data?.kind === 1063 ? data.tags : null;

	return (
		<div className="mt-3 rounded-lg border border-zinc-800 px-3 py-3">
			{data ? (
				<>
					<User pubkey={data.pubkey} time={data.created_at} size="small" />
					<div className="mt-2">
						{kind1 && <Kind1 content={kind1} truncate={true} />}
						{kind1063 && <Kind1063 metadata={kind1063} />}
						{!kind1 && !kind1063 && (
							<div className="flex flex-col gap-2">
								<div className="px-2 py-2 inline-flex flex-col gap-1 bg-zinc-800 rounded-md">
									<span className="text-zinc-500 text-sm font-medium leading-none">
										Kind: {data.kind}
									</span>
									<p className="text-fuchsia-500 text-sm leading-none">
										Lume isn't fully support this kind in newsfeed
									</p>
								</div>
								<div className="markdown">
									<p>{data.content}</p>
								</div>
							</div>
						)}
					</div>
				</>
			) : (
				<NoteSkeleton />
			)}
		</div>
	);
});
