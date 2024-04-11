import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function ColumnContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden scrollbar-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
