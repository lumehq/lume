import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { twMerge } from 'tailwind-merge';

import { Button } from '@shared/button';
import { Suggestion } from '@shared/composer';
import { CancelIcon } from '@shared/icons';
import { MentionNote } from '@shared/notes';

import { useComposer } from '@stores/composer';
import { FULL_RELAYS } from '@stores/constants';

import { usePublish } from '@utils/hooks/usePublish';

export function Composer() {
  const [reply, clearReply, toggle] = useComposer((state) => [
    state.reply,
    state.clearReply,
    state.toggleModal,
  ]);

  const publish = usePublish();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "What's on your mind?" }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: Suggestion,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: twMerge(
          'markdown max-h-[500px] overflow-y-auto outline-none',
          `${reply.id ? '!min-h-42' : '!min-h-[86px]'}`
        ),
      },
    },
  });

  const submit = async () => {
    let tags: string[][] = [];

    if (reply.id && reply.pubkey) {
      tags = [
        ['e', reply.id, FULL_RELAYS[0], 'reply'],
        ['p', reply.pubkey],
      ];
    } else {
      tags = [];
    }

    // serialize content
    const serializedContent = editor.getText();

    // publish message
    // await publish({ content: serializedContent, kind: 1, tags });

    // close modal
    toggle(false);
  };

  return (
    <div className="flex h-full flex-col px-4 pb-4">
      <div className="flex h-full w-full gap-2">
        <div className="flex w-8 shrink-0 items-center justify-center">
          <div className="h-full w-[2px] bg-zinc-800" />
        </div>
        <div className="w-full">
          <EditorContent editor={editor} />
          {reply.id && (
            <div className="relative">
              <MentionNote id={reply.id} />
              <button
                type="button"
                onClick={() => clearReply()}
                className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center gap-2 rounded bg-zinc-800 px-2 hover:bg-zinc-700"
              >
                <CancelIcon className="h-4 w-4 text-zinc-100" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div />
        <Button onClick={() => submit()} preset="publish">
          Publish
        </Button>
      </div>
    </div>
  );
}
