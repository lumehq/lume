import ReactPlayer from "react-player/es6";

export function VideoPreview({ urls }: { urls: string[] }) {
	return (
		<div className="relative mt-3 max-w-[420px] flex w-full flex-col gap-2">
			{urls.map((url) => (
				<ReactPlayer
					key={url}
					url={url}
					width="100%"
					className="w-full h-auto border border-zinc-800/50 rounded-lg"
					controls={true}
					pip={true}
				/>
			))}
		</div>
	);
}
