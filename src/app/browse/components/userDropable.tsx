import { useDroppable } from '@dnd-kit/core';
import { twMerge } from 'tailwind-merge';

import { PlusIcon } from '@shared/icons';

export function UserDropable() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'newBlock',
  });

  return (
    <div
      ref={setNodeRef}
      className={twMerge(
        'inline-flex h-12 w-12 items-center justify-center rounded-lg border-t border-white/10 backdrop-blur-xl',
        isOver ? 'bg-fuchsia-500' : 'bg-white/20 hover:bg-white/30'
      )}
    >
      <PlusIcon className="h-4 w-4 text-white" />
    </div>
  );
}
