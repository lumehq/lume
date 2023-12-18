import { useSignal } from '@preact/signals-react';
import { Resizable } from 're-resizable';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function WidgetRoot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const width = useSignal(420);

  return (
    <Resizable
      size={{ width: width.value, height: '100%' }}
      onResizeStart={(e) => e.preventDefault()}
      onResizeStop={(_e, _direction, _ref, d) => {
        width.value = width.peek() + d.width;
      }}
      minWidth={420}
      maxWidth={600}
      className={twMerge(
        'relative flex flex-col border-r-2 border-neutral-50 hover:border-neutral-100 dark:border-neutral-950 dark:hover:border-neutral-900',
        className
      )}
      enable={{ right: true }}
    >
      {children}
    </Resizable>
  );
}
