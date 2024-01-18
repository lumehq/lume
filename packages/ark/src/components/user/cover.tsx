import { cn } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserCover({ className }: { className?: string }) {
	const user = useUserContext();

	if (!user) {
		return (
			<div
				className={cn(
					"animate-pulse bg-neutral-300 dark:bg-neutral-700",
					className,
				)}
			/>
		);
	}

	return (
		<img
			src={user.banner || user.cover}
			alt="banner"
			loading="lazy"
			decoding="async"
			style={{ contentVisibility: "auto" }}
			className={cn("object-cover", className)}
		/>
	);
}
