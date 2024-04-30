import { cn, displayNpub } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserName({
	className,
	suffix,
}: {
	className?: string;
	suffix?: string;
}) {
	const user = useUserContext();

	return (
		<div className={cn("max-w-[12rem] truncate", className)}>
			{user.profile?.display_name ||
				user.profile?.name ||
				displayNpub(user.pubkey, 16)}
			{suffix}
		</div>
	);
}
