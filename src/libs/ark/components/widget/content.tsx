import { ReactNode } from 'react';

export function WidgetContent({ children }: { children: ReactNode }) {
  return <div className="h-full w-full">{children}</div>;
}
