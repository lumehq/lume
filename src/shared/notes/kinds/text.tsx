import { memo } from 'react';

import { useRichContent } from '@utils/hooks/useRichContent';

export function TextKind({ content, truncate }: { content: string; truncate?: boolean }) {
  const { parsedContent } = useRichContent(content);

  if (truncate) {
    return (
      <div className="break-p select-text whitespace-pre-line leading-normal text-neutral-900 dark:text-neutral-100">
        {content}
      </div>
    );
  }

  return (
    <div className={'min-w-0 px-3'}>
      <div className="break-p select-text whitespace-pre-line leading-normal text-neutral-900 dark:text-neutral-100">
        {parsedContent}
      </div>
    </div>
  );
}

export const MemoizedTextKind = memo(TextKind);
