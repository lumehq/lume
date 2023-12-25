import { useStorage } from "@lume/ark";
import { MentionIcon } from "@lume/icons";
import * as Popover from "@radix-ui/react-popover";
import { Editor } from "@tiptap/react";
import { nip19 } from "nostr-tools";
import { MentionPopupItem } from "./mentionPopupItem";

export function MentionPopup({ editor }: { editor: Editor }) {
	const storage = useStorage();

	const insertMention = (pubkey: string) => {
		editor.commands.insertContent(`nostr:${nip19.npubEncode(pubkey)}`);
	};

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<button
					type="button"
					className="inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-lg bg-neutral-100 px-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
				>
					<MentionIcon className="h-5 w-5" />
					Mention
				</button>
			</Popover.Trigger>
			<Popover.Content
				side="top"
				sideOffset={5}
				className="h-full max-h-[200px] w-[250px] overflow-hidden overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
			>
				<div className="flex flex-col gap-1 py-1">
					{storage.account.contacts.length ? (
						storage.account.contacts.map((item) => (
							<button
								key={item}
								type="button"
								onClick={() => insertMention(item)}
							>
								<MentionPopupItem pubkey={item} />
							</button>
						))
					) : (
						<div className="flex h-16 items-center justify-center">
							Contact list is empty
						</div>
					)}
				</div>
			</Popover.Content>
		</Popover.Root>
	);
}
