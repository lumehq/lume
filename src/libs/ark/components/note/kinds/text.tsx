import { twMerge } from 'tailwind-merge';
import { useRichContent } from '@libs/ark';

export function NoteTextContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const { parsedContent } = useRichContent(content);

  return (
    <div
      className={twMerge(
        'break-p select-text whitespace-pre-line text-balance leading-normal',
        className
      )}
    >
      {parsedContent}
    </div>
  );
}
