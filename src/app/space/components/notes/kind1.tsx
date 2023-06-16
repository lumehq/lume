import { LinkPreview } from "./preview/link";
import { MentionNote } from "@app/space/components/notes/mentions/note";
import { ImagePreview } from "@app/space/components/notes/preview/image";
import { VideoPreview } from "@app/space/components/notes/preview/video";
import { truncateContent } from "@utils/transform";

export function Kind1({
	content,
	truncate = false,
}: { content: any; truncate?: boolean }) {
	return (
		<>
			<div className="select-text whitespace-pre-line break-words text-base leading-tight text-zinc-100">
				{truncate ? truncateContent(content.parsed, 120) : content.parsed}
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
