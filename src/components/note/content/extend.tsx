import NoteMetadata from '@components/note/content/metadata';
import NotePreview from '@components/note/content/preview';
import { UserLarge } from '@components/user/large';
import { UserMention } from '@components/user/mention';

import destr from 'destr';
import { memo, useMemo } from 'react';
import reactStringReplace from 'react-string-replace';

export const ContentExtend = memo(function ContentExtend({ data }: { data: any }) {
  const content = useMemo(() => {
    let parsedContent;
    // get data tags
    const tags = destr(data.tags);
    // remove all image urls
    parsedContent = data.content.replace(/(https?:\/\/.*\.(jpg|jpeg|gif|png|webp|mp4|webm)((\?.*)$|$))/gim, '');
    // handle urls
    parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => (
      <a key={match + i} href={match} target="_blank" rel="noreferrer">
        {match}
      </a>
    ));
    // handle hashtags
    parsedContent = reactStringReplace(parsedContent, /#(\w+)/g, (match, i) => (
      <span key={match + i} className="text-fuchsia-500">
        #{match}
      </span>
    ));
    // handle mentions
    if (tags.length > 0) {
      parsedContent = reactStringReplace(parsedContent, /\#\[(\d+)\]/gm, (match, i) => {
        if (tags[match][0] === 'p') {
          return <UserMention key={match + i} pubkey={tags[match][1]} />;
        } else {
          // #TODO: handle mention other note
          // console.log(tags[match]);
        }
      });
    }

    return parsedContent;
  }, [data.content, data.tags]);

  return (
    <div className="relative z-10 flex flex-col">
      <UserLarge pubkey={data.pubkey} time={data.created_at} />
      <div className="mt-3">
        <div className="flex flex-col gap-2">
          <div className="prose prose-zinc max-w-none break-words text-[15px] leading-tight dark:prose-invert prose-headings:mt-3 prose-headings:mb-2 prose-p:m-0 prose-p:text-[15px] prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-ul:mt-2 prose-li:my-1">
            {content}
          </div>
          <NotePreview content={data.content} />
        </div>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-5 flex items-center border-t border-b border-zinc-800 py-2"
      >
        <NoteMetadata
          eventID={data.id}
          eventPubkey={data.pubkey}
          eventContent={data.content}
          eventTime={data.created_at}
        />
      </div>
    </div>
  );
});
