import { displayNpub } from "@/commons";
import { LumeWindow, useProfile } from "@/system";
import { memo } from "react";

export const MentionUser = memo(function MentionUser({
	pubkey,
}: { pubkey: string }) {
	const { isLoading, profile } = useProfile(pubkey);

	return (
		<button
			type="button"
			onClick={() => LumeWindow.openProfile(pubkey)}
			className="break-words text-start text-blue-500 hover:text-blue-600"
		>
			{isLoading
				? displayNpub(pubkey, 16)
				: `@${profile?.name || profile?.display_name || displayNpub(pubkey, 16)}`}
		</button>
	);
});
