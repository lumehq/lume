import { MentionNote } from "@shared/notes/mentions/note";
import { ImagePreview } from "@shared/notes/preview/image";
import { LinkPreview } from "@shared/notes/preview/link";
import { VideoPreview } from "@shared/notes/preview/video";
import { ReactNode } from "react";

export function Kind1({
	content,
	truncate = false,
}: {
	content: {
		original: string;
		parsed: ReactNode[];
		notes: string[];
		images: string[];
		videos: string[];
		links: string[];
	};
	truncate?: boolean;
}) {
	return (
		<>
			<div
				className={`select-text whitespace-pre-line	break-words text-base text-zinc-100 ${
					truncate ? "line-clamp-3" : ""
				}`}
			>
				{content.parsed}
			</div>
			{content.images.length > 0 && (
				<ImagePreview urls={content.images} truncate={truncate} />
			)}
			{content.videos.length > 0 && <VideoPreview urls={content.videos} />}
			{content.links.length > 0 && <LinkPreview urls={content.links} />}
			{content.notes.length > 0 &&
				content.notes.map((note: string) => (
					<MentionNote key={note} id={note} />
				))}
		</>
	);
}
