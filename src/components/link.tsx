import { usePageContext } from '@utils/hooks/usePageContext';

import { AnchorHTMLAttributes, ClassAttributes } from 'react';

export function Link(
  props: JSX.IntrinsicAttributes & ClassAttributes<HTMLAnchorElement> & AnchorHTMLAttributes<HTMLAnchorElement>,
  activeClass: string
) {
  const pageContext = usePageContext();
  const className = [props.className, pageContext.urlPathname === props.href && activeClass].filter(Boolean).join(' ');
  return <a {...props} className={className} />;
}
