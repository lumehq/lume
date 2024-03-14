import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function ColumnRoot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shadow-primary relative mx-2 flex h-full w-[420px] flex-col rounded-xl bg-white dark:bg-black",
        className,
      )}
    >
      {children}
    </div>
  );
}
