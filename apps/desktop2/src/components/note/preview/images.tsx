import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Carousel, CarouselItem } from "@lume/ui";

export function Images({ urls }: { urls: string[] }) {
	const open = async (url: string) => {
		const name = new URL(url).pathname
			.split("/")
			.pop()
			.replace(/[^a-zA-Z ]/g, "");
		const label = `viewer-${name}`;
		const window = WebviewWindow.getByLabel(label);

		if (!window) {
			const newWindow = new WebviewWindow(label, {
				url,
				title: "Image Viewer",
				width: 800,
				height: 800,
				titleBarStyle: "overlay",
			});

			return newWindow;
		}

		return await window.setFocus();
	};

	if (urls.length === 1) {
		return (
			<div className="px-3 group">
				<img
					src={urls[0]}
					alt={urls[0]}
					loading="lazy"
					decoding="async"
					style={{ contentVisibility: "auto" }}
					className="max-h-[400px] w-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
					onClick={() => open(urls[0])}
					onKeyDown={() => open(urls[0])}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
						currentTarget.src = "/404.jpg";
					}}
				/>
			</div>
		);
	}

	return (
		<Carousel
			items={urls}
			renderItem={({ item, isSnapPoint }) => (
				<CarouselItem key={item} isSnapPoint={isSnapPoint}>
					<img
						src={item}
						alt={item}
						loading="lazy"
						decoding="async"
						style={{ contentVisibility: "auto" }}
						className="object-cover w-full h-full rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
						onClick={() => open(item)}
						onKeyDown={() => open(item)}
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = "/404.jpg";
						}}
					/>
				</CarouselItem>
			)}
		/>
	);
}
