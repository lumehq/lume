import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  Hashtag,
  ImagePreview,
  LinkPreview,
  MentionNote,
  MentionUser,
  VideoPreview,
} from '@shared/notes';

import { RichContent } from '@utils/types';

export function NoteContent({ content, long }: { content: RichContent; long?: boolean }) {
  if (long) {
    return (
      <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
        {content as unknown as string}
      </ReactMarkdown>
    );
  }

  return (
    <>
      <ReactMarkdown
        className="markdown"
        remarkPlugins={[remarkGfm]}
        components={{
          del: ({ children }) => {
            const key = children[0] as string;
            if (key.startsWith('pub') && key.length > 50 && key.length < 100)
              return <MentionUser pubkey={key.replace('pub-', '')} />;
            if (key.startsWith('tag')) return <Hashtag tag={key.replace('tag-', '')} />;
          },
        }}
      >
        {content?.parsed}
      </ReactMarkdown>
      {content?.images?.length > 0 && <ImagePreview urls={content.images} />}
      {content?.videos?.length > 0 && <VideoPreview urls={content.videos} />}
      {content?.links?.length > 0 && <LinkPreview urls={content.links} />}
      {content?.notes?.length > 0 &&
        content?.notes.map((note: string) => <MentionNote key={note} id={note} />)}
    </>
  );
}
