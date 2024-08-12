export function Videos({ urls }: { urls: string[] }) {
	return (
		<div className="group px-3">
			{urls.map((url) => (
				<video
					key={url}
					className="max-h-[400px] w-auto  object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
					preload="metadata"
					controls
					muted
				>
					<source src={`${urls[0]}#t=0.1`} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			))}
		</div>
	);
}
