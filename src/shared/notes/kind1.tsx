import { LinkPreview } from "./preview/link";
import { MentionNote } from "@shared/notes/mentions/note";
import { ImagePreview } from "@shared/notes/preview/image";
import { VideoPreview } from "@shared/notes/preview/video";
import { truncateContent } from "@utils/transform";

export function Kind1({
	content,
	truncate = false,
}: { content: any; truncate?: boolean }) {
	return (
		<>
			<div
				className={`select-text whitespace-pre-line break-words text-base text-zinc-100 ${
					truncate ? "line-clamp-3" : ""
				}`}
			>
				{content.parsed}
			</div>
			{Array.isArray(content.images) && content.images.length ? (
				<ImagePreview urls={content.images} />
			) : (
				<></>
			)}
			{Array.isArray(content.videos) && content.videos.length ? (
				<VideoPreview urls={content.videos} />
			) : (
				<></>
			)}
			{Array.isArray(content.links) && content.links.length ? (
				<LinkPreview urls={content.links} />
			) : (
				<></>
			)}
			{Array.isArray(content.notes) && content.notes.length ? (
				content.notes.map((note: string) => (
					<MentionNote key={note} id={note} />
				))
			) : (
				<></>
			)}
		</>
	);
}
