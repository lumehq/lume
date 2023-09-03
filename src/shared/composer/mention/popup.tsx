import * as Popover from '@radix-ui/react-popover';
import { Editor } from '@tiptap/react';
import { nip19 } from 'nostr-tools';

import { useStorage } from '@libs/storage/provider';

import { MentionItem } from '@shared/composer';
import { MentionIcon } from '@shared/icons';

export function MentionPopup({ editor }: { editor: Editor }) {
  const { db } = useStorage();

  const insertMention = (pubkey: string) => {
    editor.commands.insertContent(`nostr:${nip19.npubEncode(pubkey)}`);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10 hover:backdrop-blur-xl"
        >
          <MentionIcon className="h-5 w-5 text-white/80" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="h-full max-h-[200px] w-[250px] overflow-hidden overflow-y-auto rounded-lg bg-white/10 backdrop-blur-xl focus:outline-none">
        <div className="flex flex-col gap-1 py-1">
          {db.account.follows.map((item) => (
            <button key={item} type="button" onClick={() => insertMention(item)}>
              <MentionItem pubkey={item} />
            </button>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
