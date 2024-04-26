import { cn } from "@lume/utils";
import { type ReactNode } from "react";

export function ColumnRoot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}
