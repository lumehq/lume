import { Content } from '@components/note/content';

export default function NoteReply({ event }: { event: any }) {
  return (
    <div className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 py-4 hover:bg-zinc-800">
      <Content data={event} />
    </div>
  );
}
