import { appSettings, cn } from "@/commons";
import { ZapIcon } from "@/components";
import { LumeWindow } from "@/system";
import { useSearch } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useNoteContext } from "../provider";

export function NoteZap({
	label = false,
	smol = false,
}: { label?: boolean; smol?: boolean }) {
	const search = useSearch({ strict: false });
	const visible = useStore(appSettings, (state) => state.display_zap_button);
	const event = useNoteContext();

	if (!visible) return null;

	return (
		<button
			type="button"
			onClick={() => LumeWindow.openZap(event.id, search.account)}
			className={cn(
				"h-7 rounded-full inline-flex items-center justify-center text-neutral-800 hover:bg-black/5 dark:hover:bg-white/5 dark:text-neutral-200 text-sm font-medium",
				label ? "w-24 gap-1.5" : "w-14",
			)}
		>
			<ZapIcon className={smol ? "size-4" : "size-5"} />
			{label ? "Zap" : null}
		</button>
	);
}
