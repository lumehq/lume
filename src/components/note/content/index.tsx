import NoteMetadata from '@components/note/content/metadata';
import NotePreview from '@components/note/content/preview';
import { UserExtend } from '@components/user/extend';

import dynamic from 'next/dynamic';
import { memo } from 'react';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
  loading: () => <div className="h-4 w-36 animate-pulse rounded bg-zinc-700" />,
});

export const Content = memo(function Content({ data }: { data: any }) {
  return (
    <div className="relative z-10 flex flex-col">
      <UserExtend pubkey={data.pubkey} time={data.created_at} />
      <div className="-mt-4 pl-[60px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div>
              <MarkdownPreview
                source={data.content}
                className={
                  'prose prose-zinc max-w-none break-words dark:prose-invert prose-headings:mt-3 prose-headings:mb-2 prose-p:m-0 prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-ul:mt-2 prose-li:my-1'
                }
                linkTarget="_blank"
                disallowedElements={[
                  'Table',
                  'Heading ID',
                  'Highlight',
                  'Fenced Code Block',
                  'Footnote',
                  'Definition List',
                  'Task List',
                ]}
              />
            </div>
            <NotePreview content={data.content} />
          </div>
          <NoteMetadata
            eventID={data.id}
            eventPubkey={data.pubkey}
            eventContent={data.content}
            eventTime={data.created_at}
          />
        </div>
      </div>
    </div>
  );
});
