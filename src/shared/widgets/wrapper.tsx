import { Resizable } from 're-resizable';
import { ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function WidgetWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [width, setWidth] = useState(420);

  return (
    <Resizable
      size={{ width: width, height: '100vh' }}
      onResizeStart={(e) => e.preventDefault()}
      onResizeStop={(_e, _direction, _ref, d) => {
        setWidth((prevWidth) => prevWidth + d.width);
      }}
      minWidth={420}
      minHeight={'100vh'}
      className={twMerge(
        'h-full border-r border-zinc-100 pb-10 dark:border-zinc-900',
        className
      )}
      enable={{ right: true }}
    >
      {children}
    </Resizable>
  );
}
