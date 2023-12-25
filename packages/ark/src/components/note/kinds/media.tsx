import { DownloadIcon } from "@lume/icons";
import { fileType } from "@lume/utils";
import { NDKTag } from "@nostr-dev-kit/ndk";
import { downloadDir } from "@tauri-apps/api/path";
import { download } from "@tauri-apps/plugin-upload";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
	DefaultVideoLayout,
	defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export function NoteMediaContent({
	tags,
	className,
}: {
	tags: NDKTag[];
	className?: string;
}) {
	const url = tags.find((el) => el[0] === "url")[1];
	const type = fileType(url);

	const downloadImage = async (url: string) => {
		const downloadDirPath = await downloadDir();
		const filename = url.substring(url.lastIndexOf("/") + 1);
		return await download(url, downloadDirPath + `/${filename}`);
	};

	if (type === "image") {
		return (
			<div key={url} className={twMerge("group relative", className)}>
				<img
					src={url}
					alt={url}
					loading="lazy"
					decoding="async"
					style={{ contentVisibility: "auto" }}
					className="h-auto w-full object-cover"
				/>
				<button
					type="button"
					onClick={() => downloadImage(url)}
					className="absolute right-2 top-2 hidden h-10 w-10 items-center justify-center rounded-lg bg-black/50 backdrop-blur-xl group-hover:inline-flex hover:bg-blue-500"
				>
					<DownloadIcon className="h-5 w-5 text-white" />
				</button>
			</div>
		);
	}

	if (type === "video") {
		return (
			<div className={className}>
				<MediaPlayer
					src={url}
					className="w-full overflow-hidden rounded-lg"
					aspectRatio="16/9"
					load="visible"
				>
					<MediaProvider />
					<DefaultVideoLayout icons={defaultLayoutIcons} />
				</MediaPlayer>
			</div>
		);
	}

	return (
		<div className={className}>
			<Link
				to={url}
				target="_blank"
				rel="noreferrer"
				className="text-blue-500 hover:text-blue-600"
			>
				{url}
			</Link>
		</div>
	);
}
