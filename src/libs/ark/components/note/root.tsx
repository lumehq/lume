import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function NoteRoot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge('h-min w-full p-3', className)}>
      <div className="relative flex flex-col overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-950">
        {children}
      </div>
    </div>
  );
}
