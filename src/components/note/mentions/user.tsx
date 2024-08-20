import { LumeWindow, useProfile } from "@/system";

export function MentionUser({ pubkey }: { pubkey: string }) {
	const { isLoading, profile } = useProfile(pubkey);

	return (
		<button
			type="button"
			onClick={() => LumeWindow.openProfile(pubkey)}
			className="break-words text-start text-blue-500 hover:text-blue-600"
		>
			{isLoading
				? "@anon"
				: `@${profile?.name || profile?.display_name || pubkey}`}
		</button>
	);
}
