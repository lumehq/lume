import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function ColumnRoot({
  children,
  shadow = true,
  className,
}: {
  children: ReactNode;
  shadow?: boolean;
  className?: string;
}) {
  return (
    <div className="h-full w-full p-2">
      <div
        className={cn(
          "relative flex h-full w-full flex-col rounded-xl bg-white dark:bg-black",
          shadow ? "shadow-primary" : "",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
