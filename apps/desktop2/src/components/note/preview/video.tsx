export function VideoPreview({ url }: { url: string }) {
	return (
		<div className="my-1">
			<video
				className="max-h-[600px] w-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
				controls
				muted
			>
				<source src={url} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
}
