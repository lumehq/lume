import { Image } from "@shared/image";

import { DEFAULT_AVATAR } from "@stores/constants";

import { useProfile } from "@utils/hooks/useProfile";

export default function MiniMember({ pubkey }: { pubkey: string }) {
	const { user, isError, isLoading } = useProfile(pubkey);

	return (
		<>
			{isError || isLoading ? (
				<div className="h-8 w-8 animate-pulse rounded-md bg-zinc-800" />
			) : (
				<Image
					className="inline-block h-8 w-8 rounded-md bg-white ring-2 ring-zinc-950 transition-all duration-150 ease-in-out"
					src={user?.picture || DEFAULT_AVATAR}
					alt={user?.pubkey || "user avatar"}
				/>
			)}
		</>
	);
}
