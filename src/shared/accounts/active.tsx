import { Image } from "@shared/image";

import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";

export default function ActiveAccount({ data }: { data: any }) {
	const { user } = useProfile(data.pubkey);

	return (
		<button type="button" className="relative h-11 w-11 overflow-hidden">
			<Image
				src={user?.picture || DEFAULT_AVATAR}
				alt={data.npub}
				className="h-11 w-11 rounded-md object-cover"
			/>
		</button>
	);
}
