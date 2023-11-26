import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { convert } from 'html-to-text';
import { nip19 } from 'nostr-tools';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { MediaUploader, MentionPopup } from '@app/new/components';

import { useNDK } from '@libs/ndk/provider';

import { CancelIcon, LoaderIcon } from '@shared/icons';
import { MentionNote } from '@shared/notes';

import { WIDGET_KIND } from '@stores/constants';

import { useSuggestion } from '@utils/hooks/useSuggestion';
import { useWidget } from '@utils/hooks/useWidget';

export function NewPostScreen() {
  const { ndk } = useNDK();
  const { addWidget } = useWidget();
  const { suggestion } = useSuggestion();

  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({ placeholder: 'Sharing some thoughts...' }),
      Image.configure({
        HTMLAttributes: {
          class:
            'rounded-lg w-full object-cover h-auto max-h-[400px] border border-neutral-200 dark:border-neutral-800 outline outline-1 outline-offset-0 outline-neutral-300 dark:outline-neutral-700',
        },
      }),
      CharacterCount.configure(),
      Mention.configure({
        suggestion,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderLabel({ options, node }) {
          const npub = nip19.npubEncode(node.attrs.id);
          return `nostr:${npub}`;
        },
      }),
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
      if (!ndk.signer) return navigate('/new/privkey');

      setLoading(true);

      // get plaintext content
      const html = editor.getHTML();
      const serializedContent = convert(html, {
        selectors: [
          { selector: 'a', options: { linkBrackets: false } },
          { selector: 'img', options: { linkBrackets: false } },
        ],
      });

      const event = new NDKEvent(ndk);
      event.content = serializedContent;
      event.kind = NDKKind.Text;

      // add reply to tags if present
      const replyTo = searchParams.get('replyTo');
      const rootReplyTo = searchParams.get('rootReplyTo');

      if (rootReplyTo) {
        const rootEvent = await ndk.fetchEvent(rootReplyTo);
        event.tag(rootEvent, 'root');
      }

      if (replyTo) {
        const replyEvent = await ndk.fetchEvent(replyTo);
        event.tag(replyEvent, 'reply');
      }

      // publish event
      const publishedRelays = await event.publish();

      if (publishedRelays) {
        toast.success(`Broadcasted to ${publishedRelays.size} relays successfully.`);

        // update state
        setLoading(false);
        setSearchParams({});

        // open new widget with this event id
        if (!replyTo) {
          addWidget.mutate({
            title: 'Thread',
            content: event.id,
            kind: WIDGET_KIND.thread,
          });
        }

        // reset editor
        editor.commands.clearContent();
        localStorage.setItem('editor-post', '{}');
      }
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  useLayoutEffect(() => {
    setHeight(containerRef.current.clientHeight);
  }, []);

  useEffect(() => {
    if (editor) editor.commands.focus('end');
  }, [editor]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex-1 overflow-y-auto">
        <div ref={containerRef} style={{ height: `${height}px` }}>
          <EditorContent
            editor={editor}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {searchParams.get('replyTo') && (
            <div className="relative max-w-lg">
              <MentionNote id={searchParams.get('replyTo')} editing />
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded bg-neutral-200 px-2 dark:bg-neutral-800"
              >
                <CancelIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="inline-flex h-16 w-full items-center justify-between border-t border-neutral-100 bg-neutral-50 dark:border-neutral-900 dark:bg-neutral-950">
        <span className="text-sm font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
          {editor?.storage?.characterCount.characters()} characters
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
            className="inline-flex h-9 w-20 items-center justify-center rounded-lg bg-blue-500 px-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading === true ? <LoaderIcon className="h-5 w-5 animate-spin" /> : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
