import { WIDGET_KIND } from "@lume/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { memo } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../../../hooks/useProfile";
import { useWidget } from "../../../hooks/useWidget";

export const MentionUser = memo(function MentionUser({
	pubkey,
}: { pubkey: string }) {
	const { user } = useProfile(pubkey);
	const { addWidget } = useWidget();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="break-words text-blue-500 hover:text-blue-600">
				{`@${user?.name || user?.displayName || user?.username || "anon"}`}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="left-[50px] z-50 relative flex w-[200px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 focus:outline-none dark:border-neutral-900">
				<DropdownMenu.Item asChild>
					<Link
						to={`/users/${pubkey}`}
						className="inline-flex h-10 items-center px-4 text-sm text-white hover:bg-neutral-900 focus:outline-none"
					>
						View profile
					</Link>
				</DropdownMenu.Item>
				<DropdownMenu.Item asChild>
					<button
						type="button"
						onClick={() =>
							addWidget.mutate({
								kind: WIDGET_KIND.user,
								title: user?.name || user?.displayName || "",
								content: pubkey,
							})
						}
						className="inline-flex h-10 items-center px-4 text-sm text-white hover:bg-neutral-900 focus:outline-none"
					>
						Pin
					</button>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
});
