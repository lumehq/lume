import { NoteSkeleton } from '@shared/notes';
import { User } from '@shared/user';

import { useEvent } from '@utils/hooks/useEvent';

export function ChildNote({ id, isRoot }: { id: string; isRoot?: boolean }) {
  const { status, data } = useEvent(id);

  if (status === 'pending') {
    return <NoteSkeleton />;
  }

  return (
    <div className="relative flex gap-3">
      <div className="relative flex-1 rounded-md bg-neutral-200 px-2 py-2 dark:bg-neutral-800">
        <div className="absolute right-0 top-[18px] h-3 w-3 -translate-y-1/2 translate-x-1/2 rotate-45 transform bg-neutral-200 dark:bg-neutral-800"></div>
        <div className="break-p mt-6 line-clamp-3 select-text leading-normal text-neutral-900 dark:text-neutral-100">
          {data.content}
        </div>
      </div>
      <User
        pubkey={data.pubkey}
        time={data.created_at}
        variant="childnote"
        subtext={isRoot ? 'posted' : 'replied'}
      />
    </div>
  );
}
