import { Image } from "@shared/image";

import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";

export function InactiveAccount({ data }: { data: any }) {
	const { user } = useProfile(data.npub);

	return (
		<div className="relative h-11 w-11 shrink rounded-md">
			<Image
				src={user?.picture || DEFAULT_AVATAR}
				alt={data.npub}
				className="h-11 w-11 rounded-lg object-cover"
			/>
		</div>
	);
}
