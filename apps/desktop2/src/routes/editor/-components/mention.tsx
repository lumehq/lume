import { MentionIcon } from "@lume/icons";
import { cn, insertMention } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { User } from "@lume/ui";
import { useSlateStatic } from "slate-react";
import type { Contact } from "@lume/types";
import { toast } from "sonner";

export function MentionButton({ className }: { className?: string }) {
	const editor = useSlateStatic();
	const { ark } = useRouteContext({ strict: false });
	const [contacts, setContacts] = useState<string[]>([]);

	const select = async (user: string) => {
		try {
			const metadata = await ark.get_profile(user);
			const contact: Contact = { pubkey: user, profile: metadata };

			insertMention(editor, contact);
		} catch (e) {
			toast.error(String(e));
		}
	};

	useEffect(() => {
		async function getContacts() {
			const data = await ark.get_contact_list();
			setContacts(data);
		}

		getContacts();
	}, []);

	return (
		<DropdownMenu.Root>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={150}>
					<DropdownMenu.Trigger asChild>
						<Tooltip.Trigger asChild>
							<button
								type="button"
								className={cn(
									"inline-flex items-center justify-center",
									className,
								)}
							>
								<MentionIcon className="size-4" />
							</button>
						</Tooltip.Trigger>
					</DropdownMenu.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
							Mention
							<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="flex w-[220px] h-[220px] scrollbar-none flex-col overflow-y-auto rounded-xl bg-black py-1 shadow-md shadow-neutral-500/20 focus:outline-none dark:bg-white">
					{contacts.map((contact) => (
						<DropdownMenu.Item
							key={contact}
							onClick={() => select(contact)}
							className="shrink-0 h-11 flex items-center hover:bg-white/10 px-2"
						>
							<User.Provider pubkey={contact}>
								<User.Root className="flex items-center gap-2">
									<User.Avatar className="shrink-0 size-8 rounded-full" />
									<User.Name className="text-sm font-medium text-white dark:text-black" />
								</User.Root>
							</User.Provider>
						</DropdownMenu.Item>
					))}
					<DropdownMenu.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
