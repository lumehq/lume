import { usePageContext } from '@utils/hooks/usePageContext';

import { twMerge } from 'tailwind-merge';

export function ActiveLink({
  href,
  className,
  activeClassName,
  children,
}: {
  href: string;
  className: string;
  activeClassName: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const pathName = pageContext.urlPathname;

  let newClassName = '';

  if (href === pathName) {
    newClassName = activeClassName;
  } else {
    newClassName = '';
  }

  return (
    <a href={href} className={twMerge(className, newClassName)}>
      {children}
    </a>
  );
}
