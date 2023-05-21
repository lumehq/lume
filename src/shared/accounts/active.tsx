import { Image } from "@shared/image";

import { DEFAULT_AVATAR } from "@stores/constants";

export default function ActiveAccount({ user }: { user: any }) {
	const userData = JSON.parse(user.metadata);

	return (
		<button type="button" className="relative h-11 w-11 overflow-hidden">
			<Image
				src={userData.picture || DEFAULT_AVATAR}
				alt="user's avatar"
				className="h-11 w-11 rounded-md object-cover"
			/>
		</button>
	);
}
