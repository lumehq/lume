import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { convert } from 'html-to-text';
import { nip19 } from 'nostr-tools';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Suggestion } from '@shared/composer';
import { CancelIcon, LoaderIcon, PlusCircleIcon } from '@shared/icons';
import { MentionNote } from '@shared/notes';

import { useComposer } from '@stores/composer';

import { useNostr } from '@utils/hooks/useNostr';
import { useImageUploader } from '@utils/hooks/useUploader';
import { sendNativeNotification } from '@utils/notification';

export function Composer() {
  const { publish } = useNostr();

  const [status, setStatus] = useState<null | 'loading' | 'done'>(null);
  const [reply, clearReply] = useComposer((state) => [state.reply, state.clearReply]);

  const expand = useComposer((state) => state.expand)
  const upload = useImageUploader();

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
            'rounded-lg w-2/3 h-auto border border-white/10 outline outline-2 outline-offset-0 outline-white/20 ml-1',
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'h-full markdown break-all overflow-y-auto outline-none pr-2',
      },
    },
  });

  const uploadImage = async (file?: string) => {
    const image = await upload(file, true);
    if (image.url) {
      editor.commands.setImage({ src: image.url });
      editor.commands.createParagraphNear();
    }
  };

  const submit = async () => {
    setStatus('loading');

    try {
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
      await sendNativeNotification('Publish post successfully');

      // update state
      setStatus('done');
      // reset editor
      editor.commands.clearContent();
      if (reply.id) {
        clearReply();
      }
    } catch {
      setStatus(null);
      console.log('failed to publish');
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
            className={twMerge('scrollbar-hide markdown break-all max-h-[500px] overflow-y-auto outline-none pr-2', expand ? 'min-h-[500px]' : 'min-h-[120px]')}
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
      <div className="flex items-center justify-between bg-white/5 rounded-b-xl p-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => uploadImage()}
          className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-xl hover:bg-white/10"
        >
          <PlusCircleIcon className="h-5 w-5 text-white" />
        </button>
        <button onClick={() => submit()} className="inline-flex items-center justify-center w-max px-8 rounded-lg font-bold h-10 bg-fuchsia-500 hover:bg-fuchsia-600">
          {status === 'loading' ? (
            <LoaderIcon className="h-4 w-4 animate-spin text-white" />
          ) : (
            'Post'
          )}
        </button>
      </div>
    </div>
  );
}
