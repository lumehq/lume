import { useLiveThread } from "@app/space/hooks/useLiveThread";
import { getNoteByID, removeBlock } from "@libs/storage";
import { Kind1 } from "@shared/notes/contents/kind1";
import { Kind1063 } from "@shared/notes/contents/kind1063";
import { NoteMetadata } from "@shared/notes/metadata";
import { NoteReplyForm } from "@shared/notes/replies/form";
import { RepliesList } from "@shared/notes/replies/list";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { TitleBar } from "@shared/titleBar";
import { User } from "@shared/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "@utils/hooks/useAccount";
import { parser } from "@utils/parser";

export function ThreadBlock({ params }: { params: any }) {
	useLiveThread(params.content);

	const queryClient = useQueryClient();

	const { account } = useAccount();
	const { status, data } = useQuery(["thread", params.content], async () => {
		const res = await getNoteByID(params.content);
		res["content"] = parser(res);
		return res;
	});

	const block = useMutation({
		mutationFn: (id: string) => {
			return removeBlock(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks"] });
		},
	});

	return (
		<div className="shrink-0 w-[400px] border-r border-zinc-900">
			<TitleBar title={params.title} onClick={() => block.mutate(params.id)} />
			<div className="scrollbar-hide flex w-full h-full flex-col gap-1.5 pt-1.5 pb-20 overflow-y-auto">
				{status === "loading" ? (
					<div className="px-3 py-1.5">
						<div className="rounded-md bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
							<NoteSkeleton />
						</div>
					</div>
				) : (
					<div className="h-min w-full px-3 py-1.5">
						<div className="rounded-md bg-zinc-900 px-5 pt-5">
							<User pubkey={data.pubkey} time={data.created_at} />
							<div className="mt-3">
								{data.kind === 1 && <Kind1 content={data.content} />}
								{data.kind === 1063 && <Kind1063 metadata={data.tags} />}
								<NoteMetadata
									id={data.event_id || params.content}
									eventPubkey={data.pubkey}
								/>
							</div>
						</div>
						<div className="mt-3 bg-zinc-900 rounded-md">
							{account && (
								<NoteReplyForm
									rootID={params.content}
									userPubkey={account.pubkey}
								/>
							)}
						</div>
					</div>
				)}
				<div className="px-3">
					<RepliesList parent_id={params.content} />
				</div>
			</div>
		</div>
	);
}
