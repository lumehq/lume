import { cn, displayNpub } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserName({
	className,
	prefix,
}: {
	className?: string;
	prefix?: string;
}) {
	const user = useUserContext();

	return (
		<div className={cn("max-w-[12rem] truncate", className)}>
			{prefix}
			{user.profile?.display_name ||
				user.profile?.name ||
				displayNpub(user.pubkey, 16)}
		</div>
	);
}
