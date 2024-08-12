import { cn } from "@/commons";
import { useUserContext } from "./provider";

export function UserAbout({ className }: { className?: string }) {
	const user = useUserContext();

	return (
		<div className={cn("content-break select-text", className)}>
			{user.profile?.about?.trim() || "No bio"}
		</div>
	);
}
