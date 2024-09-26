// @ts-nocheck
import { type Mention, commands } from "@/commands.gen";
import { cn } from "@/commons";
import { Spinner } from "@/components";
import { Note } from "@/components/note";
import { User } from "@/components/user";
import { LumeEvent, useEvent } from "@/system";
import { Feather } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { nip19 } from "nostr-tools";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import {
	RichTextarea,
	type RichTextareaHandle,
	createRegexRenderer,
} from "rich-textarea";
import { MediaButton } from "./-components/media";
import { PowButton } from "./-components/pow";
import { WarningButton } from "./-components/warning";

type EditorSearch = {
	reply_to: string;
	quote: string;
};

const MENTION_REG = /\B@([\-+\w]*)$/;
const MAX_LIST_LENGTH = 5;

const renderer = createRegexRenderer([
	[
		/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g,
		({ children, key, value }) => (
			<a
				key={key}
				href={value}
				target="_blank"
				rel="noreferrer"
				className="text-blue-500 !underline"
			>
				{children}
			</a>
		),
	],
	[
		/(?:^|\W)nostr:(\w+)(?!\w)/g,
		({ children, key, value }) => (
			<a
				key={key}
				href={value}
				target="_blank"
				rel="noreferrer"
				className="text-blue-500"
			>
				{children}
			</a>
		),
	],
]);

export const Route = createFileRoute("/editor/")({
	validateSearch: (search: Record<string, string>): EditorSearch => {
		return {
			reply_to: search.reply_to,
			quote: search.quote,
		};
	},
	beforeLoad: async ({ search }) => {
		let users: Mention[] = [];
		let initialValue: string;

		if (search?.quote?.length) {
			initialValue = `\nnostr:${nip19.noteEncode(search.quote)}`;
		} else {
			initialValue = "";
		}

		const res = await commands.getMentionList();

		if (res.status === "ok") {
			users = res.data;
		}

		return { users, initialValue };
	},
	component: Screen,
});

function Screen() {
	const { reply_to } = Route.useSearch();
	const { users, initialValue } = Route.useRouteContext();

	const [isPending, startTransition] = useTransition();
	const [text, setText] = useState("");
	const [attaches, setAttaches] = useState<string[]>(null);
	const [warning, setWarning] = useState({ enable: false, reason: "" });
	const [difficulty, setDifficulty] = useState({ enable: false, num: 21 });
	const [index, setIndex] = useState<number>(0);
	const [pos, setPos] = useState<{
		top: number;
		left: number;
		caret: number;
	} | null>(null);

	const ref = useRef<RichTextareaHandle>(null);
	const targetText = pos ? text.slice(0, pos.caret) : text;
	const match = pos && targetText.match(MENTION_REG);
	const name = match?.[1] ?? "";
	const filtered = useMemo(
		() =>
			users
				.filter((u) => u.name.toLowerCase().startsWith(name.toLowerCase()))
				.slice(0, MAX_LIST_LENGTH),
		[name],
	);

	const insert = (i: number) => {
		if (!ref.current || !pos) return;

		const selected = filtered[i];

		ref.current.setRangeText(
			`nostr:${selected.pubkey} `,
			pos.caret - name.length - 1,
			pos.caret,
			"end",
		);

		setPos(null);
		setIndex(0);
	};

	const publish = async () => {
		startTransition(async () => {
			try {
				const content = text.trim();

				await LumeEvent.publish(
					content,
					warning.enable && warning.reason.length ? warning.reason : null,
					difficulty.num,
					reply_to,
				);

				setText("");
			} catch {
				return;
			}
		});
	};

	useEffect(() => {
		if (initialValue?.length) {
			setText(initialValue);
		}
	}, [initialValue]);

	return (
		<div className="flex flex-col w-full h-full">
			<div data-tauri-drag-region className="h-11 shrink-0" />
			<div className="flex flex-col flex-1 overflow-y-auto">
				{reply_to?.length ? (
					<div className="flex flex-col gap-2 px-3.5 pb-3 border-b border-black/5 dark:border-white/5">
						<span className="text-sm font-semibold">Reply to:</span>
						<EmbedNote id={reply_to} />
					</div>
				) : null}
				<div className="p-4 overflow-y-auto h-full">
					<RichTextarea
						ref={ref}
						value={text}
						placeholder={reply_to ? "Type your reply..." : "What're you up to?"}
						style={{ width: "100%", height: "100%" }}
						className="text-[15px] leading-normal resize-none border-none focus:outline-none focus:ring-0 placeholder:text-neutral-500 placeholder:pt-[1.5px] placeholder:pl-2"
						onChange={(e) => setText(e.target.value)}
						onKeyDown={(e) => {
							if (!pos || !filtered.length) return;
							switch (e.code) {
								case "ArrowUp": {
									e.preventDefault();
									const nextIndex =
										index <= 0 ? filtered.length - 1 : index - 1;
									setIndex(nextIndex);
									break;
								}
								case "ArrowDown": {
									e.preventDefault();
									const prevIndex =
										index >= filtered.length - 1 ? 0 : index + 1;
									setIndex(prevIndex);
									break;
								}
								case "Enter":
									e.preventDefault();
									insert(index);
									break;
								case "Escape":
									e.preventDefault();
									setPos(null);
									setIndex(0);
									break;
								default:
									break;
							}
						}}
						onSelectionChange={(r) => {
							if (
								r.focused &&
								MENTION_REG.test(text.slice(0, r.selectionStart))
							) {
								setPos({
									top: r.top + r.height,
									left: r.left,
									caret: r.selectionStart,
								});
								setIndex(0);
							} else {
								setPos(null);
								setIndex(0);
							}
						}}
					>
						{renderer}
					</RichTextarea>
					{pos
						? createPortal(
								<Menu
									top={pos.top}
									left={pos.left}
									users={filtered}
									index={index}
									insert={insert}
								/>,
								document.body,
							)
						: null}
				</div>
			</div>
			{warning.enable ? (
				<div className="flex items-center w-full px-4 border-t h-11 shrink-0 border-black/5 dark:border-white/5">
					<span className="text-sm shrink-0 text-black/50 dark:text-white/50">
						Reason:
					</span>
					<input
						type="text"
						placeholder="NSFW..."
						value={warning.reason}
						onChange={(e) =>
							setWarning((prev) => ({ ...prev, reason: e.target.value }))
						}
						className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-black/50 dark:placeholder:text-white/50"
					/>
				</div>
			) : null}
			{difficulty.enable ? (
				<div className="flex items-center w-full px-4 border-t h-11 shrink-0 border-black/5 dark:border-white/5">
					<span className="text-sm shrink-0 text-black/50 dark:text-white/50">
						Difficulty:
					</span>
					<input
						type="text"
						inputMode="numeric"
						pattern="[0-9]"
						onKeyDown={(event) => {
							if (!/[0-9]/.test(event.key)) {
								event.preventDefault();
							}
						}}
						placeholder="21"
						defaultValue={difficulty.num}
						onChange={(e) =>
							setWarning((prev) => ({ ...prev, num: Number(e.target.value) }))
						}
						className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-black/50 dark:placeholder:text-white/50"
					/>
				</div>
			) : null}
			<div
				data-tauri-drag-region
				className="flex items-center w-full h-16 gap-4 px-4 border-t divide-x divide-black/5 dark:divide-white/5 shrink-0 border-black/5 dark:border-white/5"
			>
				<button
					type="button"
					onClick={() => publish()}
					className="inline-flex items-center justify-center h-8 gap-1 px-2.5 text-sm font-medium rounded-lg bg-black/10 w-max hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
				>
					{isPending ? (
						<Spinner className="size-4" />
					) : (
						<Feather className="size-4" weight="fill" />
					)}
					Publish
				</button>
				<div className="inline-flex items-center flex-1 gap-2 pl-4">
					<MediaButton setText={setText} setAttaches={setAttaches} />
					<WarningButton setWarning={setWarning} />
					<PowButton setDifficulty={setDifficulty} />
				</div>
			</div>
		</div>
	);
}

function Menu({
	users,
	index,
	top,
	left,
	insert,
}: {
	users: Mention[];
	index: number;
	top: number;
	left: number;
	insert: (index: number) => void;
}) {
	return (
		<div
			style={{
				top: top,
				left: left,
			}}
			className="fixed w-[200px] text-sm bg-white dark:bg-black shadow-lg shadow-neutral-500/20 rounded-lg overflow-hidden"
		>
			{users.map((u, i) => (
				<div
					key={u.pubkey}
					className={cn(
						"flex items-center gap-1.5 p-2",
						index === i ? "bg-neutral-100 dark:bg-neutral-900" : null,
					)}
					onMouseDown={(e) => {
						e.preventDefault();
						insert(i);
					}}
				>
					<div className="size-7 shrink-0">
						{u.avatar?.length ? (
							<img
								src={u.avatar}
								className="size-7 rounded-full outline outline-1 -outline-offset-1 outline-black/15"
								loading="lazy"
								decoding="async"
							/>
						) : (
							<div className="size-7 rounded-full bg-blue-500" />
						)}
					</div>
					{u.name}
				</div>
			))}
		</div>
	);
}

function EmbedNote({ id }: { id: string }) {
	const { isLoading, isError, data } = useEvent(id);

	if (isLoading) {
		return <Spinner className="size-5" />;
	}

	if (isError || !data) {
		return <div>Event not found with your current relay set.</div>;
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className="flex items-center gap-2">
				<User.Provider pubkey={data.pubkey}>
					<User.Root className="shrink-0">
						<User.Avatar className="rounded-full size-7" />
					</User.Root>
				</User.Provider>
				<div className="content-break line-clamp-1 text-sm">{data.content}</div>
			</Note.Root>
		</Note.Provider>
	);
}
