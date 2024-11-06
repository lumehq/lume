import { cn } from "@/commons";
import { ZapIcon } from "@/components";
import { settingsQueryOptions } from "@/routes/__root";
import { LumeWindow } from "@/system";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNoteContext } from "../provider";

export function NoteZap({
	label = false,
	smol = false,
}: { label?: boolean; smol?: boolean }) {
	const settings = useSuspenseQuery(settingsQueryOptions);
	const event = useNoteContext();

	if (!settings.data.display_zap_button) return null;

	return (
		<button
			type="button"
			onClick={() => LumeWindow.openZap(event.id)}
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
