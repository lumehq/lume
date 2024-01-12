import { useArk, useProfile } from "@lume/ark";
import { useNetworkStatus } from "@lume/utils";
import * as Avatar from "@radix-ui/react-avatar";
import { minidenticon } from "minidenticons";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export function ActiveAccount() {
	const ark = useArk();
	const isOnline = useNetworkStatus();

	const { user } = useProfile(ark.account.pubkey);

	const svgURI = `data:image/svg+xml;utf8,${encodeURIComponent(
		minidenticon(ark.account.pubkey, 90, 50),
	)}`;

	return (
		<Link to="/settings/" className="relative inline-block">
			<Avatar.Root>
				<Avatar.Image
					src={user?.picture || user?.image}
					alt={ark.account.pubkey}
					loading="lazy"
					decoding="async"
					style={{ contentVisibility: "auto" }}
					className="aspect-square h-auto w-full rounded-xl object-cover"
				/>
				<Avatar.Fallback delayMs={150}>
					<img
						src={svgURI}
						alt={ark.account.pubkey}
						className="aspect-square h-auto w-full rounded-xl bg-black dark:bg-white"
					/>
				</Avatar.Fallback>
			</Avatar.Root>
			<span
				className={twMerge(
					"absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-neutral-100 dark:ring-neutral-900",
					isOnline ? "bg-teal-500" : "bg-red-500",
				)}
			/>
		</Link>
	);
}
