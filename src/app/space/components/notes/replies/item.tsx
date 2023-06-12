import { Kind1 } from "@app/space/components/notes/kind1";
import { NoteMetadata } from "@app/space/components/notes/metadata";
import { NoteReplyUser } from "@app/space/components/user/reply";
import { noteParser } from "@utils/parser";

export function Reply({ data }: { data: any }) {
	const content = noteParser(data);

	return (
		<div className="flex h-min min-h-min w-full select-text flex-col px-3 pt-5 mb-3 rounded-md bg-zinc-900">
			<div className="flex flex-col">
				<NoteReplyUser pubkey={data.pubkey} time={data.created_at} />
				<div className="-mt-[20px] pl-[47px]">
					<Kind1 content={content} />
					<NoteMetadata id={data.id} eventPubkey={data.pubkey} />
				</div>
			</div>
		</div>
	);
}
