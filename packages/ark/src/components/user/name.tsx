import { cn } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserName({ className }: { className?: string }) {
	const user = useUserContext();

	if (!user) {
		return (
			<div
				className={cn(
					"h-4 w-20 bg-black/20 dark:bg-white/20 animate-pulse",
					className,
				)}
			/>
		);
	}

	return (
		<div className={cn("w-full max-w-[15rem] truncate", className)}>
			{user.displayName || user.name || "Anon"}
		</div>
	);
}
