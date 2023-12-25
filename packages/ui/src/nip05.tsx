import { UnverifiedIcon, VerifiedIcon } from "@lume/icons";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

interface NIP05 {
	names: {
		[key: string]: string;
	};
}

export const NIP05 = memo(function NIP05({
	pubkey,
	nip05,
	className,
}: {
	pubkey: string;
	nip05: string;
	className?: string;
}) {
	const { status, data } = useQuery({
		queryKey: ["nip05", nip05],
		queryFn: async ({ signal }: { signal: AbortSignal }) => {
			try {
				const localPath = nip05.split("@")[0];
				const service = nip05.split("@")[1];
				const verifyURL = `https://${service}/.well-known/nostr.json?name=${localPath}`;

				const res = await fetch(verifyURL, {
					method: "GET",
					headers: {
						"Content-Type": "application/json; charset=utf-8",
					},
					signal,
				});

				if (!res.ok)
					throw new Error(`Failed to fetch NIP-05 service: ${nip05}`);

				const data: NIP05 = await res.json();
				if (data.names) {
					if (data.names[localPath.toLowerCase()] === pubkey) return true;
					if (data.names[localPath] === pubkey) return true;
					return false;
				}
				return false;
			} catch (e) {
				throw new Error(`Failed to verify NIP-05, error: ${e}`);
			}
		},
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	if (status === "pending") {
		<div className="h-4 w-4 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />;
	}

	return (
		<div className="inline-flex items-center gap-1">
			<p className={twMerge("text-sm font-medium", className)}>
				{nip05.startsWith("_@") ? nip05.replace("_@", "") : nip05}
			</p>
			{data === true ? (
				<VerifiedIcon className="h-4 w-4 text-teal-500" />
			) : (
				<UnverifiedIcon className="h-4 w-4 text-red-500" />
			)}
		</div>
	);
});
