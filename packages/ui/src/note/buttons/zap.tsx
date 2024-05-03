import { ZapIcon } from "@lume/icons";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { useNoteContext } from "../provider";
import { cn } from "@lume/utils";

export function NoteZap({ large = false }: { large?: boolean }) {
	const event = useNoteContext();
	const { ark, settings } = useRouteContext({ strict: false });
	const { account } = useSearch({ strict: false });

	const zap = async () => {
		try {
			const nwc = await ark.load_nwc();
			if (!nwc) {
				ark.open_nwc();
			} else {
				ark.open_zap(event.id, event.pubkey, account);
			}
		} catch (e) {
			toast.error(String(e));
		}
	};

	if (!settings.zap) return null;

	return (
		<button
			type="button"
			onClick={() => zap()}
			className={cn(
				"inline-flex items-center justify-center text-neutral-800 dark:text-neutral-200",
				large
					? "bg-neutral-100 dark:bg-white/10 h-7 gap-1.5 w-24 text-sm font-medium hover:text-blue-500 hover:bg-neutral-200 dark:hover:bg-white/20"
					: "size-7",
			)}
		>
			<ZapIcon className="size-4" />
			{large ? "Zap" : null}
		</button>
	);
}
