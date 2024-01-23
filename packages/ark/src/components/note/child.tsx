import { NOSTR_MENTIONS } from "@lume/utils";
import { nanoid } from "nanoid";
import { nip19 } from "nostr-tools";
import { ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import reactStringReplace from "react-string-replace";
import { useEvent } from "../../hooks/useEvent";
import { User } from "../user";
import { Hashtag } from "./mentions/hashtag";
import { MentionUser } from "./mentions/user";

export function NoteChild({
	eventId,
	isRoot,
}: { eventId: string; isRoot?: boolean }) {
	const { isLoading, isError, data } = useEvent(eventId);

	const richContent = useMemo(() => {
		if (!data) return "";

		let parsedContent: string | ReactNode[] = data.content.replace(
			/\n+/g,
			"\n",
		);

		const text = parsedContent as string;
		const words = text.split(/( |\n)/);

		const hashtags = words.filter((word) => word.startsWith("#"));
		const mentions = words.filter((word) =>
			NOSTR_MENTIONS.some((el) => word.startsWith(el)),
		);

		try {
			if (hashtags.length) {
				for (const hashtag of hashtags) {
					const regex = new RegExp(`(|^)${hashtag}\\b`, "g");
					parsedContent = reactStringReplace(parsedContent, regex, () => {
						return <Hashtag key={nanoid()} tag={hashtag} />;
					});
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
					return (
						<Link
							key={match + i}
							to={url.toString()}
							target="_blank"
							rel="noreferrer"
							className="break-p font-normal text-blue-500 hover:text-blue-600"
						>
							{url.toString()}
						</Link>
					);
				},
			);

			return parsedContent;
		} catch (e) {
			console.log(e);
			return parsedContent;
		}
	}, [data]);

	if (isLoading) {
		return (
			<div className="relative flex gap-3">
				<div className="relative flex-1 rounded-md bg-neutral-200 px-2 py-2 dark:bg-neutral-800">
					<div className="h-4 w-full animate-pulse bg-neutral-300 dark:bg-neutral-700" />
				</div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="relative flex gap-3">
				<div className="relative flex-1 rounded-md bg-neutral-200 px-2 py-2 dark:bg-neutral-800">
					Failed to fetch event
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex gap-3">
			<div className="relative flex-1 rounded-md bg-neutral-200 px-2 py-2 dark:bg-neutral-800">
				<div className="absolute right-0 top-[18px] h-3 w-3 -translate-y-1/2 translate-x-1/2 rotate-45 transform bg-neutral-200 dark:bg-neutral-800" />
				<div className="break-p mt-6 line-clamp-3 select-text leading-normal text-neutral-900 dark:text-neutral-100">
					{richContent}
				</div>
			</div>
			<User.Provider pubkey={data.pubkey}>
				<User.Root>
					<User.Avatar className="size-10 shrink-0 rounded-lg object-cover" />
					<div className="absolute left-2 top-2 inline-flex items-center gap-1.5 font-semibold leading-tight">
						<User.Name className="max-w-[10rem] truncate" />
						<div className="font-normal text-neutral-700 dark:text-neutral-300">
							{isRoot ? "posted:" : "replied:"}
						</div>
					</div>
				</User.Root>
			</User.Provider>
		</div>
	);
}
