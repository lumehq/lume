import { Kind1 } from "@app/note/components/kind1";
import NoteReplyUser from "@app/note/components/user/reply";

import { noteParser } from "@utils/parser";

export default function Reply({ data }: { data: any }) {
	const content = noteParser(data);

	return (
		<div className="flex h-min min-h-min w-full select-text flex-col px-3 py-3">
			<div className="flex flex-col">
				<NoteReplyUser pubkey={data.pubkey} time={data.created_at} />
				<div className="-mt-[20px] pl-[47px]">
					<Kind1 content={content} />
				</div>
			</div>
		</div>
	);
}
