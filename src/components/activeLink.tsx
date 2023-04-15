'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

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
  const segment = useSelectedLayoutSegment();
  const isActive = href.includes(segment);

  return (
    <Link href={href} className={`${className}` + ' ' + (isActive ? `${activeClassName}` : '')}>
      {children}
    </Link>
  );
};
