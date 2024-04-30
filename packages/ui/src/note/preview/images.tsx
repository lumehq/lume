import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

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
			<div className="group">
				<img
					src={urls[0]}
					alt={urls[0]}
					loading="lazy"
					decoding="async"
					style={{ contentVisibility: "auto" }}
					className="max-h-[400px] w-auto object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
					onClick={() => open(urls[0])}
				/>
			</div>
		);
	}

	return (
		<div className="w-full group flex flex-row flex-nowrap items-center gap-2 overflow-y-auto scrollbar-none">
			{urls.map((url) => (
				<div
					key={url}
					className="w-[240px] h-[320px] shrink-0 bg-neutral-100 rounded-lg flex flex-col items-center justify-center"
				>
					<img
						src={url}
						alt={url}
						loading="lazy"
						decoding="async"
						style={{ contentVisibility: "auto" }}
						className="w-full h-full object-cover rounded-lg outline outline-1 -outline-offset-1 outline-black/15"
						onClick={() => open(url)}
					/>
				</div>
			))}
		</div>
	);
}
