import { COL_TYPES } from "@lume/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { memo } from "react";
import { Link } from "react-router-dom";
import { useArk } from "../../../hooks/useArk";
import { useProfile } from "../../../hooks/useProfile";
import { useColumnContext } from "../../column/provider";

export const MentionUser = memo(function MentionUser({
	pubkey,
}: { pubkey: string }) {
	const ark = useArk();
	const cleanPubkey = ark.getCleanPubkey(pubkey);

	const { isLoading, isError, user } = useProfile(pubkey);
	const { addColumn } = useColumnContext();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="text-blue-500 break-words hover:text-blue-600">
				{isLoading
					? "@anon"
					: isError
					  ? pubkey
					  : `@${user.name || user.displayName || user.username || "anon"}`}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="left-[50px] z-50 relative flex w-[200px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 focus:outline-none dark:border-neutral-900">
				<DropdownMenu.Item asChild>
					<Link
						to={`/users/${cleanPubkey}`}
						className="inline-flex items-center h-10 px-4 text-sm text-white hover:bg-neutral-900 focus:outline-none"
					>
						View profile
					</Link>
				</DropdownMenu.Item>
				<DropdownMenu.Item asChild>
					<button
						type="button"
						onClick={async () =>
							await addColumn({
								kind: COL_TYPES.user,
								title: user?.name || user?.displayName || "Profile",
								content: cleanPubkey,
							})
						}
						className="inline-flex items-center h-10 px-4 text-sm text-white hover:bg-neutral-900 focus:outline-none"
					>
						Pin
					</button>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
});
