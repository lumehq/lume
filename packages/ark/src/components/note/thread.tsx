import { WIDGET_KIND } from '@lume/utils';
import { twMerge } from 'tailwind-merge';
import { Note } from '.';
import { useWidget } from '../../hooks/useWidget';

export function NoteThread({
  thread,
  className,
}: {
  thread: { rootEventId: string; replyEventId: string };
  className?: string;
}) {
  const { addWidget } = useWidget();

  if (!thread) return null;

  return (
    <div className={twMerge('w-full px-3', className)}>
      <div className="flex h-min w-full flex-col gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
        {thread.rootEventId ? <Note.Child eventId={thread.rootEventId} isRoot /> : null}
        {thread.replyEventId ? <Note.Child eventId={thread.replyEventId} /> : null}
        <button
          type="button"
          onClick={() =>
            addWidget.mutate({
              kind: WIDGET_KIND.thread,
              title: 'Thread',
              content: thread.rootEventId,
            })
          }
          className="self-start text-blue-500 hover:text-blue-600"
        >
          Show full thread
        </button>
      </div>
    </div>
  );
}
