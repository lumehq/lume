'use client';

import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';

export const ActiveLink = ({
  href,
  className,
  activeClassName,
  children,
}: {
  href: string;
  className: string;
  activeClassName: string;
  children: React.ReactNode;
}) => {
  const segments = useSelectedLayoutSegments();
  const isActive = href.includes(segments[1]);

  return (
    <Link prefetch={false} href={href} className={`${className}` + ' ' + (isActive ? `${activeClassName}` : '')}>
      {children}
    </Link>
  );
};
