import { cn, replyTime } from "@/commons";
import { Note } from "@/components/note";
import { type LumeEvent, LumeWindow } from "@/system";
import { CaretDown } from "@phosphor-icons/react";
import { Link, useSearch } from "@tanstack/react-router";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { nip19 } from "nostr-tools";
import { type ReactNode, memo, useCallback, useMemo } from "react";
import reactStringReplace from "react-string-replace";
import { Hashtag } from "./note/mentions/hashtag";
import { MentionUser } from "./note/mentions/user";
import { User } from "./user";

export const ReplyNote = memo(function ReplyNote({
	event,
	className,
}: {
	event: LumeEvent;
	className?: string;
}) {
	const search = useSearch({ strict: false });
	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "View Profile",
				action: () => LumeWindow.openProfile(event.pubkey),
			}),
			MenuItem.new({
				text: "Copy Public Key",
				action: async () => {
					const pubkey = await event.pubkeyAsBech32();
					await writeText(pubkey);
				},
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<Note.Provider event={event}>
			<User.Provider pubkey={event.pubkey}>
				<Note.Root className={cn("flex gap-2.5", className)}>
					<User.Root className="shrink-0">
						<button type="button" onClick={(e) => showContextMenu(e)}>
							<User.Avatar className="size-8 rounded-full" />
						</button>
					</User.Root>
					<div className="flex-1 flex flex-col gap-1">
						<div>
							<User.Name
								className="mr-2 shrink-0 inline font-medium text-blue-500"
								suffix=":"
							/>
							<Content
								text={event.content}
								className="inline select-text text-balance content-break overflow-hidden"
							/>
						</div>
						<div className="flex-1 flex items-center justify-between">
							<span className="text-sm text-neutral-500">
								{replyTime(event.created_at)}
							</span>
							<div className="flex items-center justify-end">
								<Note.Reply smol />
								<Note.Repost smol />
								<Note.Zap smol />
							</div>
						</div>
						{event.replies?.length ? (
							<div className="relative">
								<div className="pl-3 before:content-[''] before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:border-l-[2px] before:border-black/10 dark:before:border-white/10">
									{event.replies.slice(0, 2).map((reply) => (
										<ChildReply key={reply.id} event={reply} />
									))}
									{event.replies.length > 2 ? (
										<Link
											to="/columns/replies/$id"
											params={{ id: event.id }}
											search={{ ...search }}
											state={{ events: event.replies }}
										>
											<div className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500">
												<div>All {event.replies.length} replies</div>
												<CaretDown className="size-3" weight="fill" />
											</div>
										</Link>
									) : null}
								</div>
							</div>
						) : null}
					</div>
				</Note.Root>
			</User.Provider>
		</Note.Provider>
	);
});

function ChildReply({ event }: { event: LumeEvent }) {
	const search = useSearch({ strict: false });

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "View Profile",
				action: () => LumeWindow.openProfile(event.pubkey),
			}),
			MenuItem.new({
				text: "Copy Public Key",
				action: async () => {
					const pubkey = await event.pubkeyAsBech32();
					await writeText(pubkey);
				},
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<Note.Provider event={event}>
			<User.Provider pubkey={event.pubkey}>
				<div className="group flex flex-col gap-1">
					<div>
						<User.Root className="inline mr-2">
							<button type="button" onClick={(e) => showContextMenu(e)}>
								<User.Name className="font-medium text-blue-500" suffix=":" />
							</button>
						</User.Root>
						<Content
							text={event.content}
							className="inline select-text text-balance content-break overflow-hidden"
						/>
					</div>
					<div className="flex-1 flex items-center justify-between">
						<span className="text-sm text-neutral-500">
							{replyTime(event.created_at)}
						</span>
						<div className="invisible group-hover:visible flex items-center justify-end">
							<Note.Reply smol />
							<Note.Repost smol />
							<Note.Zap smol />
						</div>
					</div>
					{event.replies?.length ? (
						<div className="relative">
							<div className="pl-3 before:content-[''] before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:border-l-[2px] before:border-black/10 dark:before:border-white/10">
								{event.replies.slice(0, 2).map((reply) => (
									<ChildReply key={reply.id} event={reply} />
								))}
								{event.replies.length > 2 ? (
									<Link
										to="/columns/replies/$id"
										params={{ id: event.id }}
										search={{ ...search }}
										state={{ events: event.replies }}
										className="block"
									>
										<div className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500">
											<div>All {event.replies.length} replies</div>
											<CaretDown className="size-3" weight="fill" />
										</div>
									</Link>
								) : null}
							</div>
						</div>
					) : null}
				</div>
			</User.Provider>
		</Note.Provider>
	);
}

function Content({ text, className }: { text: string; className?: string }) {
	const content = useMemo(() => {
		let replacedText: ReactNode[] | string = text.trim();

		const nostr = replacedText
			.split(/\s+/)
			.filter((w) => w.startsWith("nostr:"));

		replacedText = reactStringReplace(text, /(https?:\/\/\S+)/g, (match, i) => (
			<a
				key={match + i}
				href={match}
				target="_blank"
				rel="noreferrer"
				className="text-blue-600 dark:text-blue-400 !underline"
			>
				{match}
			</a>
		));

		replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
			<Hashtag key={match + i} tag={match} />
		));

		for (const word of nostr) {
			const bech32 = word.replace("nostr:", "");
			const data = nip19.decode(bech32);

			switch (data.type) {
				case "npub":
					replacedText = reactStringReplace(replacedText, word, (match, i) => (
						<MentionUser key={match + i} pubkey={data.data} />
					));
					break;
				case "nprofile":
					replacedText = reactStringReplace(replacedText, word, (match, i) => (
						<MentionUser key={match + i} pubkey={data.data.pubkey} />
					));
					break;
				default:
					replacedText = reactStringReplace(replacedText, word, (match, i) => (
						<a
							key={match + i}
							href={`https://njump.me/${bech32}`}
							target="_blank"
							rel="noreferrer"
							className="text-blue-600 dark:text-blue-400 !underline"
						>
							{match}
						</a>
					));
					break;
			}
		}

		return replacedText;
	}, [text]);

	return <div className={className}>{content}</div>;
}
