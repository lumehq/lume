import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function PostEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({ placeholder: 'Type something...' }),
      Image.configure({
        HTMLAttributes: {
          class:
            'rounded-lg w-full h-auto border border-white/10 outline outline-2 outline-offset-0 outline-white/20 ml-1',
        },
      }),
    ],
    content: JSON.parse(localStorage.getItem('editor-post') || '{}'),
    editorProps: {
      attributes: {
        class:
          'h-full outline-none prose prose-lg prose-neutral max-w-none select-text whitespace-pre-line break-words dark:prose-invert hover:prose-a:text-blue-500',
      },
    },
    onUpdate: ({ editor }) => {
      const jsonContent = JSON.stringify(editor.getJSON());
      localStorage.setItem('editor-post', jsonContent);
    },
  });

  return (
    <EditorContent
      editor={editor}
      spellCheck="false"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
    />
  );
}
