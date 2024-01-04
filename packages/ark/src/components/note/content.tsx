import { cn } from "@lume/utils";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useNoteContext, useRichContent } from "../..";
import { NIP89 } from "./nip89";

export function NoteContent({
	className,
}: {
	className?: string;
}) {
	const event = useNoteContext();
	const { parsedContent } = useRichContent(event.content);

	if (event.kind !== NDKKind.Text) return <NIP89 className={className} />;

	return (
		<div
			className={cn(
				"break-p select-text whitespace-pre-line text-balance leading-normal",
				className,
			)}
		>
			{parsedContent}
		</div>
	);
}
