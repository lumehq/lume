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
  const [width, setWidth] = useState(400);

  return (
    <Resizable
      size={{ width: width, height: '100vh' }}
      onResizeStart={(e) => e.preventDefault()}
      onResizeStop={(e, direction, ref, d) => {
        setWidth((prevWidth) => prevWidth + d.width);
      }}
      minWidth={400}
      minHeight={'100vh'}
      className={twMerge(
        'relative shrink-0 grow-0 basis-[400px] bg-white/10 backdrop-blur-xl',
        className
      )}
      enable={{ right: true }}
    >
      {children}
    </Resizable>
  );
}
