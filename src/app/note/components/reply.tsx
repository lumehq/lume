import { noteParser } from '@lume/app/note/components//parser';
import { ContentMarkdown } from '@lume/app/note/components/markdown';
import ImagePreview from '@lume/app/note/components/preview/image';
import VideoPreview from '@lume/app/note/components/preview/video';
import NoteReplyUser from '@lume/app/note/components/user/reply';

export default function NoteReply({ data }: { data: any }) {
  const content = noteParser(data);

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-3.5 hover:bg-black/20">
      <div className="flex flex-col">
        <NoteReplyUser pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-[17px] pl-[48px]">
          <ContentMarkdown content={content.parsed} />
          {Array.isArray(content.images) && content.images.length ? <ImagePreview urls={content.images} /> : <></>}
          {Array.isArray(content.videos) && content.videos.length ? <VideoPreview urls={content.videos} /> : <></>}
        </div>
      </div>
    </div>
  );
}
