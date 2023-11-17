import { memo } from 'react';

import { useRichContent } from '@utils/hooks/useRichContent';

export function TextKind({ content, textmode }: { content: string; textmode?: boolean }) {
  const { parsedContent } = useRichContent(content, textmode);

  if (textmode) {
    return (
      <div className="break-p line-clamp-3 select-text leading-normal text-neutral-900 dark:text-neutral-100">
        {parsedContent}
      </div>
    );
  }

  return (
    <div className={'min-w-0 px-3'}>
      <div className="break-p select-text leading-normal text-neutral-900 dark:text-neutral-100">
        {parsedContent}
      </div>
    </div>
  );
}

export const MemoizedTextKind = memo(TextKind);
