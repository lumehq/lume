import { useStorage } from "@lume/storage";
import {
	AUDIOS,
	IMAGES,
	NOSTR_EVENTS,
	NOSTR_MENTIONS,
	VIDEOS,
	canPreview,
	cn,
	regionNames,
} from "@lume/utils";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { fetch } from "@tauri-apps/plugin-http";
import getUrls from "get-urls";
import { nanoid } from "nanoid";
import { nip19 } from "nostr-tools";
import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import reactStringReplace from "react-string-replace";
import { Hashtag } from "./mentions/hashtag";
import { MentionNote } from "./mentions/note";
import { MentionUser } from "./mentions/user";
import { NIP89 } from "./nip89";
import { ImagePreview } from "./preview/image";
import { LinkPreview } from "./preview/link";
import { VideoPreview } from "./preview/video";
import { useNoteContext } from "./provider";

export function NoteContent({
	className,
	mini = false,
	isTranslatable = false,
}: {
	className?: string;
	mini?: boolean;
	isTranslatable?: boolean;
}) {
	const storage = useStorage();
	const event = useNoteContext();

	const [content, setContent] = useState(event.content);
	const [translated, setTranslated] = useState(false);

	const richContent = useMemo(() => {
		if (event.kind !== NDKKind.Text) return content;

		let parsedContent: string | ReactNode[] = content.replace(/\n+/g, "\n");
		let linkPreview: string = undefined;
		let images: string[] = [];
		let videos: string[] = [];
		let audios: string[] = [];
		let events: string[] = [];

		const text = parsedContent;
		const words = text.split(/( |\n)/);
		const urls = [...getUrls(text)];

		if (storage.settings.media && !storage.settings.lowPower && !mini) {
			images = urls.filter((word) =>
				IMAGES.some((el) => {
					const url = new URL(word);
					const extension = url.pathname.split(".")[1];
					if (extension === el) return true;
					return false;
				}),
			);
			videos = urls.filter((word) =>
				VIDEOS.some((el) => {
					const url = new URL(word);
					const extension = url.pathname.split(".")[1];
					if (extension === el) return true;
					return false;
				}),
			);
			audios = urls.filter((word) =>
				AUDIOS.some((el) => {
					const url = new URL(word);
					const extension = url.pathname.split(".")[1];
					if (extension === el) return true;
					return false;
				}),
			);
		}

		if (!mini) {
			events = words.filter((word) =>
				NOSTR_EVENTS.some((el) => word.startsWith(el)),
			);
		}

		const hashtags = words.filter((word) => word.startsWith("#"));
		const mentions = words.filter((word) =>
			NOSTR_MENTIONS.some((el) => word.startsWith(el)),
		);

		try {
			if (images.length) {
				for (const image of images) {
					parsedContent = reactStringReplace(
						parsedContent,
						image,
						(match, i) => <ImagePreview key={match + i} url={match} />,
					);
				}
			}

			if (videos.length) {
				for (const video of videos) {
					parsedContent = reactStringReplace(
						parsedContent,
						video,
						(match, i) => <VideoPreview key={match + i} url={match} />,
					);
				}
			}

			if (audios.length) {
				for (const audio of audios) {
					parsedContent = reactStringReplace(
						parsedContent,
						audio,
						(match, i) => <VideoPreview key={match + i} url={match} />,
					);
				}
			}

			if (hashtags.length) {
				for (const hashtag of hashtags) {
					parsedContent = reactStringReplace(
						parsedContent,
						hashtag,
						(match, i) => {
							if (storage.settings.hashtag)
								return <Hashtag key={match + i} tag={hashtag} />;
							return null;
						},
					);
				}
			}

			if (events.length) {
				for (const event of events) {
					const address = event
						.replace("nostr:", "")
						.replace(/[^a-zA-Z0-9]/g, "");
					const decoded = nip19.decode(address);

					if (decoded.type === "note") {
						parsedContent = reactStringReplace(
							parsedContent,
							event,
							(match, i) => (
								<MentionNote key={match + i} eventId={decoded.data} />
							),
						);
					}

					if (decoded.type === "nevent") {
						parsedContent = reactStringReplace(
							parsedContent,
							event,
							(match, i) => (
								<MentionNote key={match + i} eventId={decoded.data.id} />
							),
						);
					}
				}
			}

			if (mentions.length) {
				for (const mention of mentions) {
					const address = mention
						.replace("nostr:", "")
						.replace("@", "")
						.replace(/[^a-zA-Z0-9]/g, "");
					const decoded = nip19.decode(address);

					if (decoded.type === "npub") {
						parsedContent = reactStringReplace(
							parsedContent,
							mention,
							(match, i) => (
								<MentionUser key={match + i} pubkey={decoded.data} />
							),
						);
					}

					if (decoded.type === "nprofile" || decoded.type === "naddr") {
						parsedContent = reactStringReplace(
							parsedContent,
							mention,
							(match, i) => (
								<MentionUser key={match + i} pubkey={decoded.data.pubkey} />
							),
						);
					}
				}
			}

			parsedContent = reactStringReplace(
				parsedContent,
				/(https?:\/\/\S+)/g,
				(match, i) => {
					const url = new URL(match);

					if (!linkPreview && canPreview(match)) {
						linkPreview = match;
						return <LinkPreview key={match + i} url={url.toString()} />;
					}

					return (
						<Link
							key={match + i}
							to={url.toString()}
							target="_blank"
							rel="noreferrer"
							className="break-all font-normal text-blue-500 hover:text-blue-600"
						>
							{url.toString()}
						</Link>
					);
				},
			);

			if (!mini) {
				parsedContent = reactStringReplace(parsedContent, "\n", () => {
					return <div key={nanoid()} className="h-3" />;
				});
			}

			if (typeof parsedContent[0] === "string") {
				parsedContent[0] = parsedContent[0].trimStart();
			}

			return parsedContent;
		} catch (e) {
			console.warn(event.id, `[parser] parse failed: ${e}`);
			return parsedContent;
		}
	}, [content]);

	const translate = async () => {
		try {
			const res = await fetch("https://translate.nostr.wine/translate", {
				method: "POST",
				body: JSON.stringify({
					q: content,
					target: "vi",
					api_key: storage.settings.translateApiKey,
				}),
				headers: { "Content-Type": "application/json" },
			});

			const data = await res.json();

			setContent(data.translatedText);
			setTranslated(true);
		} catch (e) {
			console.error(event.id, String(e));
		}
	};

	if (event.kind !== NDKKind.Text) {
		return <NIP89 className={className} />;
	}

	return (
		<div className={cn(className)}>
			<div
				className={cn(
					"break-p select-text text-balance leading-normal",
					!mini ? "whitespace-pre-line" : "",
				)}
			>
				{richContent}
			</div>
			{isTranslatable && storage.settings.translation ? (
				translated ? (
					<button
						type="button"
						onClick={() => {
							setTranslated(false);
							setContent(event.content);
						}}
						className="mt-3 text-sm text-blue-500 hover:text-blue-600 border-none shadow-none focus:outline-none"
					>
						Show original content
					</button>
				) : (
					<button
						type="button"
						onClick={translate}
						className="mt-3 text-sm text-blue-500 hover:text-blue-600 border-none shadow-none focus:outline-none"
					>
						Translate to {regionNames.of(storage.locale)}
					</button>
				)
			) : null}
		</div>
	);
}
