import { Kind1 } from "@shared/notes/contents/kind1";
import { NoteMetadata } from "@shared/notes/metadata";
import { User } from "@shared/user";
import { parser } from "@utils/parser";

export function Reply({ data }: { data: any }) {
	const content = parser(data);

	return (
		<div className="flex h-min min-h-min w-full select-text flex-col px-3 pt-5 mb-3 rounded-md bg-zinc-900">
			<div className="flex flex-col">
				<User pubkey={data.pubkey} time={data.created_at} />
				<div className="-mt-[20px] pl-[50px]">
					<Kind1 content={content} />
					<NoteMetadata id={data.id} eventPubkey={data.pubkey} />
				</div>
			</div>
		</div>
	);
}
