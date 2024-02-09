import { PinIcon } from "@lume/icons";
import { NOSTR_MENTIONS } from "@lume/utils";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import reactStringReplace from "react-string-replace";
import { useEvent } from "../../../hooks/useEvent";
import { User } from "../../user";
import { Hashtag } from "./hashtag";
import { MentionUser } from "./user";

export function MentionNote({
	eventId,
	openable = true,
}: { eventId: string; openable?: boolean }) {
	const { t } = useTranslation();
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
					parsedContent = reactStringReplace(
						parsedContent,
						hashtag,
						(match, i) => {
							return <Hashtag key={match + i} tag={hashtag} />;
						},
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
					return (
						<Link
							key={match + i}
							to={url.toString()}
							target="_blank"
							rel="noreferrer"
							className="break-p inline-block truncate w-full font-normal text-blue-500 hover:text-blue-600"
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
			<div
				contentEditable={false}
				className="flex items-center justify-between w-full p-3 my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900"
			>
				<p>Loading...</p>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div
				contentEditable={false}
				className="w-full p-3 my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900"
			>
				{t("note.error")}
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full my-1 rounded-lg cursor-default bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5">
			<User.Provider pubkey={data.pubkey}>
				<User.Root className="flex h-10 px-3 items-center gap-2">
					<User.Avatar className="size-6 shrink-0 rounded-md object-cover" />
					<div className="flex-1 inline-flex gap-2">
						<User.Name className="font-semibold text-neutral-900 dark:text-neutral-100" />
						<span className="text-neutral-600 dark:text-neutral-400">·</span>
						<User.Time
							time={data.created_at}
							className="text-neutral-600 dark:text-neutral-400"
						/>
					</div>
				</User.Root>
			</User.Provider>
			<div className="px-3 select-text text-balance leading-normal line-clamp-4 whitespace-pre-line">
				{richContent}
			</div>
			{openable ? (
				<div className="px-3 h-10 flex items-center justify-between">
					<Link
						to={`/events/${data.id}`}
						className="text-sm text-blue-500 hover:text-blue-600"
					>
						{t("note.showMore")}
					</Link>
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-md text-neutral-600 dark:text-neutral-400 size-6 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
					>
						<PinIcon className="size-4" />
					</button>
				</div>
			) : (
				<div className="h-3" />
			)}
		</div>
	);
}
