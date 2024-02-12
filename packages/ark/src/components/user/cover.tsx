import { cn } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserCover({ className }: { className?: string }) {
	const user = useUserContext();

	if (!user) {
		return (
			<div
				className={cn("animate-pulse bg-gray-3 dark:bg-gray-7", className)}
			/>
		);
	}

	if (user && !user.profile.banner) {
		return (
			<div className={cn("bg-gradient-to-b from-sky-4 to-blue-2", className)} />
		);
	}

	return (
		<img
			src={user.profile.banner}
			alt="banner"
			loading="lazy"
			decoding="async"
			style={{ contentVisibility: "auto" }}
			className={cn("object-cover", className)}
		/>
	);
}
