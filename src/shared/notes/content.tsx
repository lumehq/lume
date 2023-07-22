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

export function NoteContent({
  content,
}: {
  content: {
    original: string;
    parsed: string;
    notes: string[];
    images: string[];
    videos: string[];
    links: string[];
  };
}) {
  return (
    <>
      <ReactMarkdown
        className="markdown"
        remarkPlugins={[remarkGfm]}
        components={{
          del: ({ children }) => {
            const key = children[0] as string;
            if (key.startsWith('pub')) return <MentionUser pubkey={key.slice(3)} />;
            if (key.startsWith('tag')) return <Hashtag tag={key.slice(3)} />;
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
