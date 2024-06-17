import { RepostIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Spinner } from "@lume/ui";
import { useNoteContext } from "../provider";
import { LumeWindow } from "@lume/system";
import { Menu, MenuItem } from "@tauri-apps/api/menu";

export function NoteRepost({ large = false }: { large?: boolean }) {
	const event = useNoteContext();

	const [loading, setLoading] = useState(false);
	const [isRepost, setIsRepost] = useState(false);

	const repost = async () => {
		if (isRepost) return;

		try {
			setLoading(true);

			// repost
			await event.repost();

			// update state
			setLoading(false);
			setIsRepost(true);

			// notify
			toast.success("You've reposted this post successfully");
		} catch {
			setLoading(false);
			toast.error("Repost failed, try again later");
		}
	};

	const showContextMenu = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();

		const menuItems = await Promise.all([
			MenuItem.new({
				text: "Quote",
				action: async () => repost(),
			}),
			MenuItem.new({
				text: "Repost",
				action: () => LumeWindow.openEditor(null, event.id),
			}),
		]);

		const menu = await Menu.new({
			items: menuItems,
		});

		await menu.popup().catch((e) => console.error(e));
	}, []);

	return (
		<button
			type="button"
			onClick={(e) => showContextMenu(e)}
			className={cn(
				"inline-flex items-center justify-center text-neutral-800 dark:text-neutral-200 rounded-full",
				large
					? "bg-neutral-100 dark:bg-white/10 h-7 gap-1.5 w-24 text-sm font-medium hover:text-blue-500 hover:bg-neutral-200 dark:hover:bg-white/20"
					: "size-7",
			)}
		>
			{loading ? (
				<Spinner className="size-4" />
			) : (
				<RepostIcon className={cn("size-4", isRepost ? "text-blue-500" : "")} />
			)}
			{large ? "Repost" : null}
		</button>
	);
}
