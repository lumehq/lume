import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export function ImagePreview({ url }: { url: string }) {
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

	return (
		<div className="relative my-1 group">
			<img
				src={url}
				alt={url}
				loading="lazy"
				decoding="async"
				style={{ contentVisibility: "auto" }}
				className="max-h-[600px] w-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
				onClick={() => open(url)}
				onKeyDown={() => open(url)}
				onError={({ currentTarget }) => {
					currentTarget.onerror = null;
					currentTarget.src = "/404.jpg";
				}}
			/>
		</div>
	);
}
