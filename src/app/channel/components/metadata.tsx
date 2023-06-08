import { useChannelProfile } from "@app/channel/hooks/useChannelProfile";
import { CopyIcon } from "@shared/icons";
import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { nip19 } from "nostr-tools";

export function ChannelMetadata({
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
		<div className="flex flex-col gap-2">
			<div className="relative shrink-0 rounded-md h-11 w-11">
				<Image
					src={metadata?.image || DEFAULT_AVATAR}
					alt={id}
					className="h-11 w-11 rounded-md object-contain bg-zinc-900"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<div className="inline-flex items-center gap-1">
					<h5 className="leading-none text-lg font-semibold">
						{metadata?.name}
					</h5>
					<button type="button" onClick={() => copyNoteID()}>
						<CopyIcon width={14} height={14} className="text-zinc-400" />
					</button>
				</div>
				<p className="leading-tight text-zinc-400">
					{metadata?.about || (noteID && `${noteID.substring(0, 24)}...`)}
				</p>
			</div>
		</div>
	);
}
