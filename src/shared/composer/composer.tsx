import { TauriEvent } from '@tauri-apps/api/event';
import { getCurrent } from '@tauri-apps/api/window';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { convert } from 'html-to-text';
import { nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@shared/button';
import { Suggestion } from '@shared/composer';
import { CancelIcon, LoaderIcon, PlusCircleIcon } from '@shared/icons';
import { MentionNote } from '@shared/notes';

import { useComposer } from '@stores/composer';
import { FULL_RELAYS } from '@stores/constants';

import { usePublish } from '@utils/hooks/usePublish';
import { useImageUploader } from '@utils/hooks/useUploader';
import { sendNativeNotification } from '@utils/notification';

export function Composer() {
  const [status, setStatus] = useState<null | 'loading' | 'done'>(null);
  const [reply, clearReply, toggleModal] = useComposer((state) => [
    state.reply,
    state.clearReply,
    state.toggleModal,
  ]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: {
          color: '#fff',
        },
      }),
      Placeholder.configure({ placeholder: 'Type something...' }),
      Mention.configure({
        suggestion: Suggestion,
        renderLabel({ node }) {
          return `nostr:${nip19.npubEncode(node.attrs.id.pubkey)} `;
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class:
            'rounded-lg w-2/3 h-auto border border-zinc-800 outline outline-2 outline-offset-0 outline-zinc-700 ml-1',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: twMerge(
          'scrollbar-hide markdown break-all max-h-[500px] overflow-y-auto outline-none pr-2',
          `${reply.id ? '!min-h-42' : '!min-h-[100px]'}`
        ),
      },
    },
  });

  const upload = useImageUploader();
  const publish = usePublish();

  const uploadImage = async (file?: string) => {
    const image = await upload(file);
    if (image.url) {
      editor.commands.setImage({ src: image.url });
      editor.commands.createParagraphNear();
    }
  };

  const submit = async () => {
    setStatus('loading');
    try {
      let tags: string[][] = [];

      if (reply.id && reply.pubkey) {
        if (reply.root) {
          tags = [
            ['e', reply.root, FULL_RELAYS[0], 'root'],
            ['e', reply.id, FULL_RELAYS[0], 'reply'],
            ['p', reply.pubkey],
          ];
        } else {
          tags = [
            ['e', reply.id, FULL_RELAYS[0], 'reply'],
            ['p', reply.pubkey],
          ];
        }
      }

      // get plaintext content
      const html = editor.getHTML();
      const serializedContent = convert(html, {
        selectors: [
          { selector: 'a', options: { linkBrackets: false } },
          { selector: 'img', options: { linkBrackets: false } },
        ],
      });

      // publish message
      await publish({ content: serializedContent, kind: 1, tags });

      // send native notifiation
      await sendNativeNotification('Publish post successfully');

      // update state
      setStatus('done');
    } catch {
      setStatus(null);
      console.log('failed to publish');
    }
  };

  useEffect(() => {
    getCurrent().listen(TauriEvent.WINDOW_FILE_DROP, (event) => {
      const filepath: string = event.payload[0];
      if (filepath.match(/\.(jpg|jpeg|png|gif)$/gi)) {
        // open modal
        toggleModal(true);
      }
    });
  }, []);

  return (
    <div className="flex h-full flex-col px-4 pb-4">
      <div className="flex h-full w-full gap-3">
        <div className="flex w-8 shrink-0 items-center justify-center">
          <div className="h-full w-[2px] bg-zinc-800" />
        </div>
        <div className="w-full">
          <EditorContent
            editor={editor}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
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
        <button
          type="button"
          onClick={() => uploadImage()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-800"
        >
          <PlusCircleIcon className="h-5 w-5 text-zinc-500" />
        </button>
        <Button onClick={() => submit()} preset="publish">
          {status === 'loading' ? (
            <LoaderIcon className="h-4 w-4 animate-spin text-zinc-100" />
          ) : (
            'Publish'
          )}
        </Button>
      </div>
    </div>
  );
}
