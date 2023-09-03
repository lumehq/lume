import { HTMLProps, ReactNode, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

import { useStorage } from '@libs/storage/provider';

export function Frame({
  children,
  className,
  lighter,
}: {
  children: ReactNode;
  className: HTMLProps<HTMLElement>['className'];
  lighter?: boolean;
}) {
  const { db } = useStorage();

  const platformStyles = useCallback(() => {
    switch (db.platform) {
      case 'darwin':
      case 'win32':
        if (lighter) return 'bg-black/80';
        return 'bg-black/90';
      default:
        return 'bg-black';
    }
  }, []);

  return <div className={twMerge(className, platformStyles())}>{children}</div>;
}
