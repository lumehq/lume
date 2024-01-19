import { cn } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserAbout({ className }: { className?: string }) {
	const user = useUserContext();

	if (!user) {
		return (
			<div className="flex flex-col gap-1">
				<div
					className={cn(
						"h-4 w-20 bg-black/20 dark:bg-white/20 rounded animate-pulse",
						className,
					)}
				/>
				<div
					className={cn(
						"h-4 w-full bg-black/20 dark:bg-white/20 rounded animate-pulse",
						className,
					)}
				/>
				<div
					className={cn(
						"h-4 w-24 bg-black/20 dark:bg-white/20 rounded animate-pulse",
						className,
					)}
				/>
			</div>
		);
	}

	return (
		<div className={cn("select-text break-p", className)}>
			{user.about || user.bio}
		</div>
	);
}
