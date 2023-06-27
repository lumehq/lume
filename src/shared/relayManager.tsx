import { SignalIcon } from "@shared/icons";

export function RelayManager() {
	return (
		<button
			type="button"
			aria-label="Relay manager"
			className="inline-flex items-center justify-center w-9 h-9 rounded-md border-t bg-zinc-800 border-zinc-700/50 transform active:translate-y-1"
		>
			<SignalIcon className="w-4 h-4 text-zinc-400" />
		</button>
	);
}
