import { Image } from "@shared/image";

export default function ImagePreview({ urls }: { urls: string[] }) {
	return (
		<div className="mt-3 grid h-full w-full grid-cols-3">
			<div className="col-span-3">
				<Image
					src={urls[0]}
					alt="image"
					className="h-auto w-full rounded-lg object-cover"
				/>
			</div>
		</div>
	);
}
