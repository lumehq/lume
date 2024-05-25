import { LumeWindow, useProfile } from "@lume/system";
import { displayNpub } from "@lume/utils";

export function MentionUser({ pubkey }: { pubkey: string }) {
	const { isLoading, isError, profile } = useProfile(pubkey);

	return (
		<button
			type="button"
			onClick={() => LumeWindow.openProfile(pubkey)}
			className="break-words text-start text-blue-500 hover:text-blue-600"
		>
			{isLoading
				? "@anon"
				: isError
					? displayNpub(pubkey, 16)
					: `@${profile?.name || profile?.display_name || "anon"}`}
		</button>
	);
}
