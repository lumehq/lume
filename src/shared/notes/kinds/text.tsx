import { memo } from 'react';

import { useRichContent } from '@utils/hooks/useRichContent';

export function TextNote(props: { content?: string; truncate?: boolean }) {
  const { parsedContent } = useRichContent(props.content);

  if (props.truncate) {
    return (
      <div className="break-p select-text whitespace-pre-line leading-normal text-neutral-900 dark:text-neutral-100">
        {props.content}
      </div>
    );
  }

  return (
    <div className="break-p select-text whitespace-pre-line leading-normal text-neutral-900 dark:text-neutral-100">
      {parsedContent}
    </div>
  );
}

export const MemoizedTextNote = memo(TextNote);
