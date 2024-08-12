import { cn } from "@/commons";
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

	if (user && !user.profile?.banner) {
		return (
			<div
				className={cn("bg-gradient-to-b from-blue-400 to-teal-200", className)}
			/>
		);
	}

	return (
		<img
			src={user?.profile?.banner}
			alt="banner"
			loading="lazy"
			decoding="async"
			style={{ contentVisibility: "auto" }}
			className={cn("object-cover", className)}
		/>
	);
}
