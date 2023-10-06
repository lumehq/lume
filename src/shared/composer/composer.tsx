import { message } from '@tauri-apps/plugin-dialog';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { convert } from 'html-to-text';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { MediaUploader, MentionPopup } from '@shared/composer';
import { CancelIcon, LoaderIcon } from '@shared/icons';
import { MentionNote } from '@shared/notes';

import { useComposer } from '@stores/composer';

import { useNostr } from '@utils/hooks/useNostr';
import { sendNativeNotification } from '@utils/notification';

export function Composer() {
  const [loading, setLoading] = useState<boolean>(false);
  const [reply, clearReply] = useComposer((state) => [state.reply, state.clearReply]);

  const { publish } = useNostr();

  const expand = useComposer((state) => state.expand);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: {
          color: '#fff',
        },
      }),
      Placeholder.configure({ placeholder: 'Type something...' }),
      Image.configure({
        HTMLAttributes: {
          class:
            'rounded-lg w-2/3 h-auto border border-white/10 outline outline-2 outline-offset-0 outline-white/20 ml-1',
        },
      }),
    ],
    content: JSON.parse(localStorage.getItem('editor-content') || '{}'),
    editorProps: {
      attributes: {
        class: 'h-full markdown break-all overflow-y-auto outline-none pr-2',
      },
    },
    onUpdate: ({ editor }) => {
      const jsonContent = JSON.stringify(editor.getJSON());
      localStorage.setItem('editor-content', jsonContent);
    },
  });

  const submit = async () => {
    try {
      setLoading(true);

      // get plaintext content
      const html = editor.getHTML();
      const serializedContent = convert(html, {
        selectors: [
          { selector: 'a', options: { linkBrackets: false } },
          { selector: 'img', options: { linkBrackets: false } },
        ],
      });

      // define tags
      let tags: string[][] = [];

      // add reply to tags if present
      if (reply.id && reply.pubkey) {
        if (reply.root && reply.root.length > 1) {
          tags = [
            ['e', reply.root, '', 'root'],
            ['e', reply.id, '', 'reply'],
            ['p', reply.pubkey],
          ];
        } else {
          tags = [
            ['e', reply.id, '', 'reply'],
            ['p', reply.pubkey],
          ];
        }
      }

      // add hashtag to tags if present
      const hashtags = serializedContent
        .split(/\s/gm)
        .filter((s: string) => s.startsWith('#'));
      hashtags?.forEach((tag: string) => {
        tags.push(['t', tag.replace('#', '')]);
      });

      // publish message
      await publish({ content: serializedContent, kind: 1, tags });

      // send native notifiation
      await sendNativeNotification('Post has been published successfully.');

      // update state
      setLoading(false);
      // reset editor
      editor.commands.clearContent();
      // reset reply
      if (reply.id) {
        clearReply();
      }
    } catch {
      setLoading(false);
      await message('Publishing post failed.', { title: 'Lume', type: 'error' });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full w-full gap-3 px-4 pb-4">
        <div className="flex w-10 shrink-0 items-center justify-center">
          <div className="h-full w-[2px] bg-white/10 backdrop-blur-xl" />
        </div>
        <div className="w-full">
          <EditorContent
            editor={editor}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={twMerge(
              'scrollbar-hide markdown max-h-[500px] overflow-y-auto break-all pr-2 outline-none',
              expand ? 'min-h-[500px]' : reply.id ? 'min-h-min' : 'min-h-[120px]'
            )}
          />
          {reply.id && (
            <div className="relative">
              <MentionNote id={reply.id} />
              <button
                type="button"
                onClick={() => clearReply()}
                className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded bg-white/10 px-2 backdrop-blur-xl"
              >
                <CancelIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-b-xl border-t border-white/10 bg-white/5 p-2">
        <div className="inline-flex items-center gap-1">
          <MediaUploader editor={editor} />
          <MentionPopup editor={editor} />
        </div>
        <button
          onClick={() => submit()}
          disabled={editor && editor.isEmpty}
          className="inline-flex h-10 w-20 items-center justify-center rounded-lg bg-fuchsia-500 px-2 font-semibold hover:bg-fuchsia-600 disabled:opacity-50"
        >
          {loading === true ? (
            <LoaderIcon className="h-5 w-5 animate-spin text-white" />
          ) : (
            'Post'
          )}
        </button>
      </div>
    </div>
  );
}
