import { Image } from "@shared/image";

export function ImagePreview({ urls }: { urls: string[] }) {
	return (
		<div className="mt-3 max-w-[420px] overflow-hidden">
			<div className="flex flex-col gap-2">
				{urls.map((url) => (
					<div key={url} className="min-w-0 grow-0 shrink-0 basis-full">
						<Image
							src={url}
							fallback="https://void.cat/d/XTmrMkpid8DGLjv1AzdvcW"
							alt="image"
							className="h-auto w-full border border-zinc-800/50 rounded-lg object-cover"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
