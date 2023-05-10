import { autoUpdate, offset, shift, useFloating, useFocus, useHover, useInteractions } from '@floating-ui/react';
import { useState } from 'react';

export function Tooltip({ children, message }: { children: React.ReactNode; message: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(8), shift()],
    whileElementsMounted(...args) {
      const cleanup = autoUpdate(...args, { animationFrame: true });
      return cleanup;
    },
  });

  const hover = useHover(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          className="w-max select-none rounded-md bg-zinc-800 px-4 py-2 text-xs font-medium leading-none text-zinc-100"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          {...getFloatingProps()}
        >
          {message}
        </div>
      )}
    </>
  );
}
