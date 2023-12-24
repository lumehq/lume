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
    <div
      className={twMerge(
        'mt-3 flex h-min w-full flex-col overflow-hidden rounded-xl bg-neutral-50 px-3 dark:bg-neutral-950',
        className
      )}
    >
      {children}
    </div>
  );
}
