import { navigate } from 'vite-plugin-ssr/client/router';

export const NoteWrapper = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className: string;
}) => {
  const openThread = (event: any, href: string) => {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      navigate(href, { keepScrollPosition: true });
    } else {
      event.stopPropagation();
    }
  };

  return (
    <div onClick={(event) => openThread(event, href)} className={className}>
      {children}
    </div>
  );
};
