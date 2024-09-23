import { commands } from "@/commands.gen";
import { cn, replyTime } from "@/commons";
import { Note } from "@/components/note";
import { type LumeEvent, LumeWindow } from "@/system";
import { CaretDown } from "@phosphor-icons/react";
import { Link, useSearch } from "@tanstack/react-router";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { memo, useCallback, useEffect, useState } from "react";
import { User } from "./user";

export const ReplyNote = memo(function ReplyNote({
	event,
	className,
}: {
	event: LumeEvent;
	className?: string;
}) {
	const search = useSearch({ strict: false });
	const [isTrusted, setIsTrusted] = useState<boolean>(null);

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

	useEffect(() => {
		async function check() {
			const res = await commands.isTrustedUser(event.pubkey);

			if (res.status === "ok") {
				setIsTrusted(res.data);
			}
		}

		check();
	}, []);

	if (isTrusted !== null && isTrusted === false) {
		return <div>Not trusted</div>;
	}

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
								className="shrink-0 inline font-medium text-blue-500"
								suffix=":"
							/>
							<div className="pl-2 inline select-text text-balance content-break overflow-hidden">
								{event.content}
							</div>
						</div>
						<div className="flex-1 flex items-center justify-between">
							<span className="text-sm text-neutral-500">
								{replyTime(event.created_at)}
							</span>
							<div className="flex items-center justify-end gap-3">
								<Note.Reply />
								<Note.Repost />
								<Note.Zap />
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
						<User.Root className="inline">
							<button type="button" onClick={(e) => showContextMenu(e)}>
								<User.Name className="font-medium text-blue-500" suffix=":" />
							</button>
						</User.Root>
						<div className="pl-2 inline select-text text-balance content-break overflow-hidden">
							{event.content}
						</div>
					</div>
					<div className="flex-1 flex items-center justify-between">
						<span className="text-sm text-neutral-500">
							{replyTime(event.created_at)}
						</span>
						<div className="invisible group-hover:visible flex items-center justify-end gap-3">
							<Note.Reply />
							<Note.Repost />
							<Note.Zap />
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
