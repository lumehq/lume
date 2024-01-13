import { UnverifiedIcon, VerifiedIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { useArk } from "../../hooks/useArk";
import { useUserContext } from "./provider";

export function UserNip05({
	pubkey,
	className,
}: { pubkey: string; className?: string }) {
	const ark = useArk();
	const user = useUserContext();

	const { isLoading, data: verified } = useQuery({
		queryKey: ["nip05", user?.nip05],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			if (!user) return false;
			if (!user.nip05) return false;
			return ark.validateNIP05({
				pubkey,
				nip05: user.nip05,
				signal,
			});
		},
		enabled: !!user,
	});

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
		<div className="inline-flex items-center gap-1">
			<p className={cn("text-sm font-medium", className)}>
				{user.nip05.startsWith("_@")
					? user.nip05.replace("_@", "")
					: user.nip05}
			</p>
			{!isLoading && verified ? (
				<VerifiedIcon className="size-4 text-teal-500" />
			) : null}
		</div>
	);
}
