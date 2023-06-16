import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

export function MentionUser({ pubkey }: { pubkey: string }) {
	const { user } = useProfile(pubkey);

	return (
		<a
			href={`/user?pubkey=${pubkey}`}
			className="text-fuchsia-500 hover:text-fuchsia-600 no-underline font-normal"
		>
			@{user?.name || user?.displayName || shortenKey(pubkey)}
		</a>
	);
}
