import ReactPlayer from "react-player/es6";

export function VideoPreview({ urls }: { urls: string[] }) {
	return (
		<div className="relative mt-3 max-w-[420px] flex w-full flex-col gap-2">
			{urls.map((url) => (
				<div key={url} className="aspect-video">
					<ReactPlayer url={url} width="100%" height="100%" />
				</div>
			))}
		</div>
	);
}
