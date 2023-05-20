import { useChannelProfile } from "@app/channel/hooks/useChannelProfile";

import { Image } from "@shared/image";

import CopyIcon from "@icons/copy";

import { DEFAULT_AVATAR } from "@stores/constants";

import { nip19 } from "nostr-tools";

export default function ChannelMetadata({
	id,
	pubkey,
}: { id: string; pubkey: string }) {
	const metadata = useChannelProfile(id, pubkey);
	const noteID = id ? nip19.noteEncode(id) : null;

	const copyNoteID = async () => {
		const { writeText } = await import("@tauri-apps/api/clipboard");
		if (noteID) {
			await writeText(noteID);
		}
	};

	return (
		<div className="inline-flex items-center gap-2">
			<div className="relative shrink-0 rounded-md">
				<Image
					src={metadata?.picture || DEFAULT_AVATAR}
					alt={id}
					className="h-8 w-8 rounded bg-zinc-900 object-contain ring-2 ring-zinc-950"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-1">
					<h5 className="truncate text-base font-medium leading-none text-white">
						{metadata?.name}
					</h5>
					<button type="button" onClick={() => copyNoteID()}>
						<CopyIcon width={14} height={14} className="text-zinc-400" />
					</button>
				</div>
				<p className="text-base leading-none text-zinc-400">
					{metadata?.about || (noteID && `${noteID.substring(0, 24)}...`)}
				</p>
			</div>
		</div>
	);
}
