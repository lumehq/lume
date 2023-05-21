import { Image } from "@shared/image";

import { DEFAULT_AVATAR } from "@stores/constants";

export default function InactiveAccount({ user }: { user: any }) {
	const userData = JSON.parse(user.metadata);

	return (
		<div className="relative h-11 w-11 shrink rounded-md">
			<Image
				src={userData.picture || DEFAULT_AVATAR}
				alt="user's avatar"
				className="h-11 w-11 rounded-lg object-cover"
			/>
		</div>
	);
}
