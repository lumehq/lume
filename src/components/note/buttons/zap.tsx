import { appSettings, cn } from "@/commons";
import { LumeWindow } from "@/system";
import { Lightning } from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-store";
import { useNoteContext } from "../provider";

export function NoteZap({ large = false }: { large?: boolean }) {
	const visible = useStore(appSettings, (state) => state.display_zap_button);
	const event = useNoteContext();

	if (!visible) return null;

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
			<Lightning className="size-4" />
			{large ? "Zap" : null}
		</button>
	);
}
