import { ImageUploader } from '@shared/composer/imageUploader';
import { RelayContext } from '@shared/relayProvider';

import { WRITEONLY_RELAYS } from '@stores/constants';

import { dateToUnix } from '@utils/date';

import { getEventHash, signEvent } from 'nostr-tools';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Node, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export function Post({ pubkey, privkey }: { pubkey: string; privkey: string }) {
  const pool: any = useContext(RelayContext);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [content, setContent] = useState(null);

  const serialize = useCallback((nodes: Node[]) => {
    return nodes.map((n) => Node.string(n)).join('\n');
  }, []);

  const submit = () => {
    const event: any = {
      content: content,
      created_at: dateToUnix(),
      kind: 1,
      pubkey: pubkey,
      tags: [],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privkey);

    // publish note
    pool.publish(event, WRITEONLY_RELAYS);
    // reset form
    setContent('');
  };

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
        if (isAstChange) {
          const content = serialize(value);
          setContent(content);
        }
      }}
    >
      <div className="flex h-full flex-col px-4 pb-4">
        <div className="flex h-full w-full gap-2">
          <div className="flex w-8 shrink-0 items-center justify-center">
            <div className="h-full w-[2px] bg-zinc-800"></div>
          </div>
          <div className="prose prose-zinc relative w-full max-w-none select-text break-words dark:prose-invert prose-p:text-[15px] prose-p:leading-tight prose-a:text-[15px] prose-a:font-normal prose-a:leading-tight prose-a:text-fuchsia-500 prose-a:no-underline hover:prose-a:text-fuchsia-600 hover:prose-a:underline prose-ol:mb-1 prose-ul:mb-1 prose-li:text-[15px] prose-li:leading-tight">
            <Editable
              placeholder="What's on your mind?"
              autoCapitalize="false"
              autoCorrect="false"
              spellCheck="false"
              autoFocus={true}
              className="min-h-20 mb-3 h-20"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <ImageUploader />
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-7 w-max items-center justify-center gap-1 rounded-md bg-fuchsia-500 px-3.5 text-xs font-medium text-zinc-200 shadow-button hover:bg-fuchsia-600"
          >
            Post
          </button>
        </div>
      </div>
    </Slate>
  );
}
