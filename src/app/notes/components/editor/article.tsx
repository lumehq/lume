import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { convert } from 'html-to-text';
import { useState } from 'react';
import { toast } from 'sonner';

import { useNDK } from '@libs/ndk/provider';

import { MediaUploader, MentionPopup } from '@shared/composer';
import { LoaderIcon } from '@shared/icons';

export function ArticleEditor() {
  const { ndk } = useNDK();
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({ placeholder: 'Type something...' }),
      Image.configure({
        HTMLAttributes: {
          class:
            'rounded-lg w-full object-cover h-auto max-h-[400px] border border-neutral-200 dark:border-neutral-800 outline outline-1 outline-offset-0 outline-neutral-300 dark:outline-neutral-700',
        },
      }),
      CharacterCount.configure(),
    ],
    content: JSON.parse(localStorage.getItem('editor-post') || '{}'),
    editorProps: {
      attributes: {
        class:
          'outline-none prose prose-lg prose-neutral max-w-none select-text whitespace-pre-line break-words dark:prose-invert hover:prose-a:text-blue-500',
      },
    },
    onUpdate: ({ editor }) => {
      const jsonContent = JSON.stringify(editor.getJSON());
      localStorage.setItem('editor-post', jsonContent);
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
      const tags: string[][] = [];

      // add hashtag to tags if present
      const hashtags = serializedContent
        .split(/\s/gm)
        .filter((s: string) => s.startsWith('#'));
      hashtags?.forEach((tag: string) => {
        tags.push(['t', tag.replace('#', '')]);
      });

      // publish message
      const event = new NDKEvent(ndk);
      event.content = serializedContent;
      event.kind = NDKKind.Article;
      event.tags = tags;

      const publishedRelays = await event.publish();
      if (publishedRelays) {
        toast.success(`Broadcasted to ${publishedRelays.size} relays successfully.`);
        // update state
        setLoading(false);
        // reset editor
        editor.commands.clearContent();
        localStorage.setItem('editor-post', '{}');
      }
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <EditorContent
        editor={editor}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      <div className="flex h-16 w-full items-center justify-between border-t border-neutral-100 dark:border-neutral-900">
        <span className="text-sm font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
          {editor?.storage?.characterCount.characters()}
        </span>
        <div className="flex items-center">
          <div className="inline-flex items-center gap-2">
            <MediaUploader editor={editor} />
            <MentionPopup editor={editor} />
          </div>
          <div className="mx-3 h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
          <button
            onClick={() => submit()}
            disabled={editor && editor.isEmpty}
            className="inline-flex h-9 w-max items-center justify-center rounded-lg bg-blue-500 px-2.5 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading === true ? (
              <LoaderIcon className="h-5 w-5 animate-spin" />
            ) : (
              'Publish article'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
