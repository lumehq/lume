import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

const hexRegex = /[0-9A-Fa-f]{6}/g;

export function MentionUser(props: { children: any[] }) {
	const pubkey = props.children[0].match(hexRegex) ? props.children[0] : null;

	if (!pubkey) {
		return null;
	}

	const { user } = useProfile(pubkey);

	return (
		<span className="text-fuchsia-500">
			@{user?.name || user?.displayName || shortenKey(pubkey)}
		</span>
	);
}
