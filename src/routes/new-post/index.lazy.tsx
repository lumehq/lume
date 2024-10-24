import { type Mention, type Result, commands } from "@/commands.gen";
import { cn, displayNpub } from "@/commons";
import { PublishIcon, Spinner } from "@/components";
import { Note } from "@/components/note";
import { User } from "@/components/user";
import { useEvent } from "@/system";
import type { Metadata } from "@/types";
import { CaretDown } from "@phosphor-icons/react";
import { createLazyFileRoute, useAwaited } from "@tanstack/react-router";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { message } from "@tauri-apps/plugin-dialog";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { createPortal } from "react-dom";
import {
	RichTextarea,
	type RichTextareaHandle,
	createRegexRenderer,
} from "rich-textarea";
import { MediaButton } from "./-components/media";
import { PowButton } from "./-components/pow";
import { WarningButton } from "./-components/warning";

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
		({ children, key }) => (
			<span key={key} className="text-blue-500">
				{children}
			</span>
		),
	],
	[
		/(?:^|\W)#(\w+)(?!\w)/g,
		({ children, key }) => (
			<span key={key} className="text-blue-500">
				{children}
			</span>
		),
	],
]);

export const Route = createLazyFileRoute("/new-post/")({
	component: Screen,
});

function Screen() {
	const { reply_to } = Route.useSearch();
	const { accounts, initialValue } = Route.useRouteContext();
	const { deferMentionList } = Route.useLoaderData();
	const users = useAwaited({ promise: deferMentionList })[0];

	const [text, setText] = useState("");
	const [currentUser, setCurrentUser] = useState<string | null>(null);
	const [isPublish, setIsPublish] = useState(false);
	const [error, setError] = useState("");
	const [isPending, startTransition] = useTransition();
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
	const filtered = useMemo(() => {
		if (!users?.length) return [];
		return users
			.filter((u) => u?.name?.toLowerCase().startsWith(name.toLowerCase()))
			.slice(0, MAX_LIST_LENGTH);
	}, [users, name]);

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const list: Promise<MenuItem>[] = [];

		for (const account of accounts) {
			const res = await commands.getProfile(account);
			let name = "unknown";

			if (res.status === "ok") {
				const profile: Metadata = JSON.parse(res.data);
				name = profile.display_name ?? profile.name ?? "unknown";
			}

			list.push(
				MenuItem.new({
					text: `Publish as ${name} (${displayNpub(account, 16)})`,
					action: async () => setCurrentUser(account),
				}),
			);
		}

		const items = await Promise.all(list);
		const menu = await Menu.new({ items });

		await menu.popup().catch((e) => console.error(e));
	}, []);

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

	const submit = () => {
		startTransition(async () => {
			if (!text.length) return;
			if (!currentUser) return;

			const signer = await commands.hasSigner(currentUser);

			if (signer.status === "ok") {
				if (!signer.data) {
					const res = await commands.setSigner(currentUser);

					if (res.status === "error") {
						await message(res.error, { kind: "error" });
						return;
					}
				}

				const content = text.trim();
				const warn = warning.enable ? warning.reason : null;
				const diff = difficulty.enable ? difficulty.num : null;

				let res: Result<string, string>;

				if (reply_to?.length) {
					res = await commands.reply(content, reply_to, null);
				} else {
					res = await commands.publish(content, warn, diff);
				}

				if (res.status === "ok") {
					setText("");
					setIsPublish(true);
				} else {
					setError(res.error);
				}
			}
		});
	};

	useEffect(() => {
		if (isPublish) {
			const timer = setTimeout(() => setIsPublish((prev) => !prev), 3000);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [isPublish]);

	useEffect(() => {
		if (initialValue?.length) {
			setText(initialValue);
		}
	}, [initialValue]);

	useEffect(() => {
		if (accounts?.length) {
			setCurrentUser(accounts[0]);
		}
	}, [accounts]);

	return (
		<div className="flex flex-col w-full h-full">
			<div data-tauri-drag-region className="h-11 shrink-0" />
			<div className="flex flex-col flex-1 overflow-y-auto">
				{reply_to?.length ? (
					<div className="flex flex-col gap-2 px-3.5 pb-3 border-b border-black/5 dark:border-white/5">
						<span className="text-sm font-semibold">Reply to:</span>
						<EmbedNote id={reply_to} />
					</div>
				) : error?.length ? (
					<div className="flex flex-col gap-2 px-3.5 pb-3 border-b border-black/5 dark:border-white/5">
						<p className="text-sm font-medium text-red-600">{error}</p>
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
						disabled={isPending}
					>
						{renderer}
					</RichTextarea>
					{pos ? (
						createPortal(
							<MentionPopup
								top={pos.top}
								left={pos.left}
								users={filtered}
								index={index}
								insert={insert}
							/>,
							document.body,
						)
					) : (
						<></>
					)}
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
				<div className="inline-flex items-center gap-3">
					<button
						type="button"
						onClick={() => submit()}
						className={cn(
							"inline-flex items-center justify-center h-8 gap-1 px-2.5 text-sm font-medium rounded-lg w-max",
							isPublish
								? "bg-green-500 hover:bg-green-600 dark:hover:bg-green-400 text-white"
								: "bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20",
						)}
					>
						{isPending ? (
							<Spinner className="size-4" />
						) : (
							<PublishIcon className="size-4" />
						)}
						{isPublish ? "Published" : "Publish"}
					</button>
					{currentUser ? (
						<button
							type="button"
							onClick={(e) => showContextMenu(e)}
							className="inline-flex items-center gap-1.5"
						>
							<User.Provider pubkey={currentUser}>
								<User.Root>
									<User.Avatar className="size-6 rounded-full" />
								</User.Root>
							</User.Provider>
							<CaretDown
								className="mt-px size-3 text-neutral-500"
								weight="bold"
							/>
						</button>
					) : null}
				</div>
				<div className="inline-flex items-center flex-1 gap-2 pl-2">
					<MediaButton setText={setText} />
					<WarningButton setWarning={setWarning} />
					<PowButton setDifficulty={setDifficulty} />
				</div>
			</div>
		</div>
	);
}

function MentionPopup({
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
			className="fixed w-[200px] text-sm bg-white dark:bg-black shadow-lg shadow-neutral-500/20 dark:shadow-none dark:ring-1 dark:ring-neutral-700 rounded-lg overflow-hidden"
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
								alt=""
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
