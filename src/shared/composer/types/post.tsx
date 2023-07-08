import { useCallback, useMemo, useState } from 'react';
import { Node, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, useSlateStatic, withReact } from 'slate-react';

import { usePublish } from '@libs/ndk';

import { Button } from '@shared/button';
import { ImageUploader } from '@shared/composer/imageUploader';
import { CancelIcon, TrashIcon } from '@shared/icons';
import { MentionNote } from '@shared/notes/mentions/note';

import { useComposer } from '@stores/composer';
import { FULL_RELAYS } from '@stores/constants';

const withImages = (editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  return editor;
};

const ImagePreview = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: any;
  element: any;
}) => {
  const editor: any = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  return (
    <figure {...attributes} className="m-0 mt-3">
      {children}
      <div contentEditable={false} className="relative">
        <img
          alt={element.url}
          src={element.url}
          className="m-0 h-auto max-h-[300px] w-full rounded-md object-cover"
        />
        <button
          type="button"
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className="shadow-mini-button absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center gap-0.5 rounded bg-zinc-800 text-base font-medium text-zinc-400 hover:bg-zinc-700"
        >
          <TrashIcon width={14} height={14} className="text-zinc-100" />
        </button>
      </div>
    </figure>
  );
};

export function Post() {
  const publish = usePublish();
  const editor = useMemo(() => withReact(withImages(withHistory(createEditor()))), []);

  const [reply, clearReply, toggle] = useComposer((state) => [
    state.reply,
    state.clearReply,
    state.toggleModal,
  ]);
  const [content, setContent] = useState<Node[]>([
    {
      children: [
        {
          text: '',
        },
      ],
    },
  ]);

  const serialize = useCallback((nodes: Node[]) => {
    return nodes.map((n) => Node.string(n)).join('\n');
  }, []);

  const removeReply = () => {
    clearReply();
  };

  const submit = async () => {
    let tags: string[][] = [];

    if (reply.id && reply.pubkey) {
      if (reply.root && reply.root !== reply.id) {
        tags = [
          ['e', reply.id, FULL_RELAYS[0], 'root'],
          ['e', reply.root, FULL_RELAYS[0], 'reply'],
          ['p', reply.pubkey],
        ];
      } else {
        tags = [
          ['e', reply.id, FULL_RELAYS[0], 'root'],
          ['p', reply.pubkey],
        ];
      }
    } else {
      tags = [];
    }

    // serialize content
    const serializedContent = serialize(content);

    // publish message
    await publish({ content: serializedContent, kind: 1, tags });

    // close modal
    toggle(false);
  };

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'image':
        if (props.element.url) {
          return <ImagePreview {...props} />;
        }
        break;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  return (
    <Slate editor={editor} value={content} onChange={setContent}>
      <div className="flex h-full flex-col px-4 pb-4">
        <div className="flex h-full w-full gap-2">
          <div className="flex w-8 shrink-0 items-center justify-center">
            <div className="h-full w-[2px] bg-zinc-800" />
          </div>
          <div className="w-full">
            <Editable
              placeholder={
                reply.id ? 'Share your thoughts on it' : "What's on your mind?"
              }
              spellCheck="false"
              className={`${
                reply.id ? '!min-h-42' : '!min-h-[86px]'
              } markdown max-h-[500px] overflow-y-auto`}
              renderElement={renderElement}
            />
            {reply.id && (
              <div className="relative">
                <MentionNote id={reply.id} />
                <button
                  type="button"
                  onClick={() => removeReply()}
                  className="absolute right-3 top-3 inline-flex h-6 w-max items-center justify-center gap-2 rounded bg-zinc-800 px-2 hover:bg-zinc-700"
                >
                  <CancelIcon className="h-4 w-4 text-zinc-100" />
                  <span className="text-sm">Stop reply</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <ImageUploader />
          <Button onClick={() => submit()} preset="publish">
            Publish
          </Button>
        </div>
      </div>
    </Slate>
  );
}
