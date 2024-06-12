import { cn } from "@lume/utils";
import { useEffect, useState } from "react";
import { Spinner } from "@lume/ui";
import { useUserContext } from "./provider";
import { NostrAccount } from "@lume/system";

export function UserFollowButton({
	simple = false,
	className,
}: {
	simple?: boolean;
	className?: string;
}) {
	const user = useUserContext();

	const [loading, setLoading] = useState(false);
	const [followed, setFollowed] = useState(false);

	const toggleFollow = async () => {
		setLoading(true);

		const toggle = await NostrAccount.toggleContact(user.pubkey);

		if (toggle) {
			setFollowed((prev) => !prev);
			setLoading(false);
		}
	};

	useEffect(() => {
		let mounted = true;

		NostrAccount.checkContact(user.pubkey).then((status) => {
			if (mounted) setFollowed(status);
		});

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<button
			type="button"
			disabled={loading}
			onClick={() => toggleFollow()}
			className={cn("w-max", className)}
		>
			{loading ? (
				<Spinner className="size-4" />
			) : followed ? (
				!simple ? (
					"Unfollow"
				) : null
			) : (
				"Follow"
			)}
		</button>
	);
}
