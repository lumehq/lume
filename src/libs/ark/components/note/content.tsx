import { useRichContent } from '@utils/hooks/useRichContent';

export function NoteContent({ content }: { content: string }) {
  const { parsedContent } = useRichContent(content);

  return (
    <div className="break-p select-text whitespace-pre-line leading-normal">
      {parsedContent}
    </div>
  );
}
