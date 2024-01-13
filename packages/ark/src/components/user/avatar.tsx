import { cn } from "@lume/utils";
import * as Avatar from "@radix-ui/react-avatar";
import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import { useUserContext } from "./provider";

export function UserAvatar({ className }: { className?: string }) {
	const user = useUserContext();
	const fallbackAvatar = useMemo(
		() =>
			`data:image/svg+xml;utf8,${encodeURIComponent(
				minidenticon(user?.pubkey, 90, 50),
			)}`,
		[user],
	);

	if (!user) {
		return (
			<div className="shrink-0">
				<div
					className={cn(
						"bg-black/20 dark:bg-white/20 animate-pulse",
						className,
					)}
				/>
			</div>
		);
	}

	return (
		<Avatar.Root className="shrink-0">
			<Avatar.Image
				src={user.image}
				alt={user.pubkey}
				loading="eager"
				decoding="async"
				className={className}
			/>
			<Avatar.Fallback delayMs={120}>
				<img
					src={fallbackAvatar}
					alt={user.pubkey}
					className={cn("bg-black dark:bg-white", className)}
				/>
			</Avatar.Fallback>
		</Avatar.Root>
	);
}
