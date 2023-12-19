import { twMerge } from 'tailwind-merge';
import { useRichContent } from '@utils/hooks/useRichContent';

export function NoteContent({
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
        'break-p select-text whitespace-pre-line leading-normal',
        className
      )}
    >
      {parsedContent}
    </div>
  );
}
