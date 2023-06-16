import { getNoteByID } from "@libs/storage";
import { ArrowLeftIcon } from "@shared/icons";
import { Kind1 } from "@shared/notes/kind1";
import { Kind1063 } from "@shared/notes/kind1063";
import { NoteMetadata } from "@shared/notes/metadata";
import { NoteReplyForm } from "@shared/notes/replies/form";
import { RepliesList } from "@shared/notes/replies/list";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { User } from "@shared/user";
import { useActiveAccount } from "@stores/accounts";
import { parser } from "@utils/parser";
import useSWR from "swr";

const fetcher = ([, id]) => getNoteByID(id);

export function ThreadBlock({ params }: { params: any }) {
	const { data } = useSWR(["thread", params.content], fetcher);
	const removeBlock = useActiveAccount((state: any) => state.removeBlock);
	const content = data ? parser(data) : null;

	const close = () => {
		removeBlock(params.id, false);
	};

	return (
		<div className="shrink-0 w-[420px] border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full flex items-center justify-between px-3 border-b border-zinc-900"
			>
				<button
					type="button"
					onClick={() => close()}
					className="inline-flex h-7 w-7 shrink items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800"
				>
					<ArrowLeftIcon width={14} height={14} className="text-zinc-500" />
				</button>
				<h3 className="font-semibold text-zinc-100">{params.title}</h3>
				<div className="w-9 h-6" />
			</div>
			<div className="scrollbar-hide flex w-full h-full flex-col gap-1.5 pt-1.5 pb-20 overflow-y-auto">
				{!data ? (
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
								{data.kind === 1 && <Kind1 content={content} />}
								{data.kind === 1063 && <Kind1063 metadata={data.tags} />}
								<NoteMetadata id={params.content} eventPubkey={data.pubkey} />
							</div>
						</div>
						<div className="mt-3 bg-zinc-900 rounded-md">
							<NoteReplyForm id={data.id} />
						</div>
					</div>
				)}
				<div className="px-3">
					<RepliesList id={params.content} />
				</div>
			</div>
		</div>
	);
}
