import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";

export function Member({ pubkey }: { pubkey: string }) {
	const { user, isError, isLoading } = useProfile(pubkey);

	return (
		<>
			{isError || isLoading ? (
				<div className="h-7 w-7 animate-pulse rounded bg-zinc-800" />
			) : (
				<Image
					className="inline-block h-7 w-7 rounded"
					src={user?.image}
					fallback={DEFAULT_AVATAR}
					alt={pubkey}
				/>
			)}
		</>
	);
}
