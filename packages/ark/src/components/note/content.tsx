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
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import reactStringReplace from "react-string-replace";
import { toast } from "sonner";
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
}: {
	className?: string;
	mini?: boolean;
}) {
	const storage = useStorage();
	const event = useNoteContext();

	const [content, setContent] = useState(event.content);
	const [translate, setTranslate] = useState({
		translatable: true,
		translated: false,
	});

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
					parsedContent = reactStringReplace(
						parsedContent,
						event,
						(match, i) => <MentionNote key={match + i} eventId={event} />,
					);
				}
			}

			if (mentions.length) {
				for (const mention of mentions) {
					parsedContent = reactStringReplace(
						parsedContent,
						mention,
						(match, i) => <MentionUser key={match + i} pubkey={mention} />,
					);
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

	const translateContent = async () => {
		try {
			if (!translate.translatable) return;

			const res = await fetch("https://translate.nostr.wine/translate", {
				method: "POST",
				body: JSON.stringify({
					q: event.content,
					target: storage.locale.slice(0, 2),
					api_key: storage.settings.translateApiKey,
				}),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok)
				toast.error(
					"Cannot connect to translate service, please try again later.",
				);

			const data = await res.json();

			setContent(data.translatedText);
			setTranslate((state) => ({ ...state, translated: true }));
		} catch (e) {
			console.error("translate api: ", String(e));
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
			{storage.settings.translation && translate.translatable ? (
				translate.translated ? (
					<button
						type="button"
						onClick={() => setContent(event.content)}
						className="mt-3 text-sm text-blue-500 hover:text-blue-600 border-none shadow-none focus:outline-none"
					>
						Show original content
					</button>
				) : (
					<button
						type="button"
						onClick={translateContent}
						className="mt-3 text-sm text-blue-500 hover:text-blue-600 border-none shadow-none focus:outline-none"
					>
						Translate to {regionNames.of(storage.locale)}
					</button>
				)
			) : null}
		</div>
	);
}
