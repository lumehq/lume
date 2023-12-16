import { NDKKind, NDKTag } from '@nostr-dev-kit/ndk';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { Markdown } from 'tiptap-markdown';
import { ArticleCoverUploader, MediaUploader, MentionPopup } from '@app/new/components';
import { useArk } from '@libs/ark';
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LoaderIcon,
  ThreadsIcon,
} from '@shared/icons';

export function NewArticleScreen() {
  const ark = useArk();

  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState({ open: false, content: '' });
  const [cover, setCover] = useState('');

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const ident = useMemo(() => String(Date.now()), []);
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
      Markdown.configure({
        html: false,
        tightLists: true,
        linkify: true,
        transformPastedText: true,
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
      localStorage.setItem('editor-article', jsonContent);
    },
  });

  const submit = async () => {
    try {
      if (!ark.readyToSign) return navigate('/new/privkey');

      setLoading(true);

      // get markdown content
      const content = editor.storage.markdown.getMarkdown();

      // define tags
      const tags: NDKTag[] = [
        ['d', ident],
        ['title', title],
        ['image', cover],
        ['summary', summary.content],
        ['published_at', String(Math.floor(Date.now() / 1000))],
      ];

      // add hashtag to tags if present
      const hashtags = content.split(/\s/gm).filter((s: string) => s.startsWith('#'));
      hashtags?.forEach((tag: string) => {
        tags.push(['t', tag.replace('#', '')]);
      });

      // publish
      const publish = await ark.createEvent({
        content,
        tags,
        kind: NDKKind.Article,
      });

      if (publish) {
        toast.success(`Broadcasted to ${publish.seens.length} relays successfully.`);

        // update state
        setLoading(false);

        // reset editor
        editor.commands.clearContent();
        localStorage.setItem('editor-article', '{}');
      }
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  useLayoutEffect(() => {
    setHeight(containerRef.current.clientHeight);
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex flex-col gap-4"
          ref={containerRef}
          style={{ height: `${height}px` }}
        >
          {cover ? (
            <img
              src={cover}
              alt="post cover"
              className="h-72 w-full rounded-lg object-cover"
            />
          ) : null}
          <div className="group flex justify-between gap-2">
            <input
              name="title"
              className="h-9 flex-1 border-none bg-transparent px-0 text-2xl font-semibold text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-none focus:outline-none focus:ring-0 dark:text-neutral-100 dark:placeholder:text-neutral-600"
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div
              className={twMerge(
                'inline-flex shrink-0 gap-2 group-hover:inline-flex',
                title.length > 0 ? '' : 'hidden'
              )}
            >
              <ArticleCoverUploader setCover={setCover} />
              <button
                type="button"
                onClick={() => setSummary((prev) => ({ ...prev, open: !prev.open }))}
                className="inline-flex h-9 w-max items-center gap-2 rounded-lg bg-neutral-100 px-2.5 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-800"
              >
                <ThreadsIcon className="h-4 w-4" />
                Add summary
              </button>
            </div>
          </div>
          {summary.open ? (
            <div className="flex gap-3">
              <div className="h-16 w-1 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex-1">
                <textarea
                  className="h-16 w-full border-none bg-transparent px-1 py-1 text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-600"
                  placeholder="A brief summary of your article"
                  value={summary.content}
                  onChange={(e) =>
                    setSummary((prev) => ({ ...prev, content: e.target.value }))
                  }
                />
              </div>
            </div>
          ) : null}
          <div>
            {editor && (
              <FloatingMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className="ml-36 inline-flex h-10 items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 px-px dark:border-neutral-800 dark:bg-neutral-900"
              >
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={twMerge(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-950',
                    editor.isActive('heading', { level: 1 })
                      ? 'bg-white shadow dark:bg-black'
                      : ''
                  )}
                >
                  <Heading1Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={twMerge(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-950',
                    editor.isActive('heading', { level: 2 })
                      ? 'bg-white shadow dark:bg-black'
                      : ''
                  )}
                >
                  <Heading2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={twMerge(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-950',
                    editor.isActive('heading', { level: 3 })
                      ? 'bg-white shadow dark:bg-black'
                      : ''
                  )}
                >
                  <Heading3Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={twMerge(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-950',
                    editor.isActive('bold') ? 'bg-white shadow dark:bg-black' : ''
                  )}
                >
                  <BoldIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={twMerge(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-950',
                    editor.isActive('italic') ? 'bg-white shadow dark:bg-black' : ''
                  )}
                >
                  <ItalicIcon className="h-5 w-5" />
                </button>
              </FloatingMenu>
            )}
            <EditorContent
              editor={editor}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="mb-3 flex h-12 w-full items-center rounded-lg bg-yellow-100 px-3 text-yellow-700">
          <p className="text-sm">
            Article editor is still in beta. If you need a stable and more reliable
            feature, you can use <b>Habla (habla.news)</b> instead.
          </p>
        </div>
        <div className="flex h-16 w-full items-center justify-between border-t border-neutral-100 dark:border-neutral-900">
          <div className="inline-flex items-center gap-3">
            <span className="text-sm font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
              {editor?.storage?.characterCount.characters()} characters
            </span>
            <span className="text-sm font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
              -
            </span>
            <span className="text-sm font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
              <b>Identifier:</b>
              {ident}
            </span>
          </div>
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
    </div>
  );
}
