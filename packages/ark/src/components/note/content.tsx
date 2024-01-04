import { cn } from "@lume/utils";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useNoteContext, useRichContent } from "../..";

export function NoteContent({
	className,
}: {
	className?: string;
}) {
	const event = useNoteContext();
	const { parsedContent } = useRichContent(event.content);

	if (event.kind === NDKKind.Text) {
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

	return (
		<div
			className={cn(
				"break-p select-text whitespace-pre-line text-balance leading-normal",
				className,
			)}
		>
			Unsupported kind
		</div>
	);
}
