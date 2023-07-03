import ReactPlayer from "react-player/es6";

export function VideoPreview({ urls }: { urls: string[] }) {
	return (
		<div className="relative mt-3 max-w-[420px] flex w-full flex-col gap-2">
			{urls.map((url) => (
				<ReactPlayer
					key={url}
					url={url}
					width="100%"
					height="auto"
					className="!h-auto object-fill rounded-lg overflow-hidden"
					controls={true}
					pip={true}
				/>
			))}
		</div>
	);
}
