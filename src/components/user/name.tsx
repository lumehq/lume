import { cn, displayNpub } from "@/commons";
import { useUserContext } from "./provider";

export function UserName({
	className,
	prefix,
	suffix,
}: {
	className?: string;
	prefix?: string;
	suffix?: string;
}) {
	const user = useUserContext();

	return (
		<span className={cn("max-w-[12rem] truncate", className)}>
			{prefix}
			{user.profile?.display_name ||
				user.profile?.name ||
				displayNpub(user.pubkey, 16)}
			{suffix}
		</span>
	);
}
