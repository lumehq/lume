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
        'relative shrink-0 grow-0 bg-white/10 backdrop-blur-xl',
        className
      )}
      enable={{ right: true }}
    >
      {children}
    </Resizable>
  );
}
