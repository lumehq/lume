import { useArk, useProfile } from "@lume/ark";
import { SettingsIcon } from "@lume/icons";
import { cn, useNetworkStatus } from "@lume/utils";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { minidenticon } from "minidenticons";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Logout } from "./logout";

export function ActiveAccount() {
	const ark = useArk();
	const isOnline = useNetworkStatus();
	const svgURI = useMemo(
		() =>
			`data:image/svg+xml;utf8,${encodeURIComponent(
				minidenticon(ark.account.pubkey, 90, 50),
			)}`,
		[],
	);

	const { user } = useProfile(ark.account.pubkey);

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<div className="relative">
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
						className={cn(
							"absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-neutral-100 dark:ring-neutral-900",
							isOnline ? "bg-teal-500" : "bg-red-500",
						)}
					/>
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					side="right"
					sideOffset={5}
					className="flex w-[200px] p-2 flex-col overflow-hidden rounded-2xl bg-black/70 dark:bg-white/10 backdrop-blur-xl focus:outline-none"
				>
					<DropdownMenu.Item asChild>
						<Link
							to="/settings/"
							className="inline-flex items-center gap-2 px-3 text-sm font-medium rounded-lg h-9 text-white/50 hover:bg-black/10 hover:text-white focus:outline-none dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
						>
							<SettingsIcon className="size-5" />
							Settings
						</Link>
					</DropdownMenu.Item>
					<Logout />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
