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
      size={{ width: width, height: '100%' }}
      onResizeStart={(e) => e.preventDefault()}
      onResizeStop={(_e, _direction, _ref, d) => {
        setWidth((prevWidth) => prevWidth + d.width);
      }}
      minWidth={420}
      maxWidth={600}
      className={twMerge(
        'flex flex-col border-r-2 border-neutral-50 hover:border-neutral-100 dark:border-neutral-950 dark:hover:border-neutral-900',
        className
      )}
      enable={{ right: true }}
    >
      {children}
    </Resizable>
  );
}
