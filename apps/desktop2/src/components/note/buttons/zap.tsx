import { ZapIcon } from "@lume/icons";
import { LumeWindow } from "@lume/system";
import { cn } from "@lume/utils";
import { useRouteContext } from "@tanstack/react-router";
import { useNoteContext } from "../provider";

export function NoteZap({ large = false }: { large?: boolean }) {
	const event = useNoteContext();
	const { settings } = useRouteContext({ strict: false });

	if (!settings.display_zap_button) return null;

	return (
		<button
			type="button"
			onClick={() => LumeWindow.openZap(event.id)}
			className={cn(
				"inline-flex items-center justify-center text-neutral-800 dark:text-neutral-200",
				large
					? "rounded-full h-7 gap-1.5 w-20 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10"
					: "size-7",
			)}
		>
			<ZapIcon className="size-4" />
			{large ? "Zap" : null}
		</button>
	);
}
