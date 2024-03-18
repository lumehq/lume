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
    <div className="h-full w-full p-2">
      <div
        className={cn(
          "shadow-primary relative flex h-full w-full flex-col rounded-xl bg-white dark:bg-black",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
