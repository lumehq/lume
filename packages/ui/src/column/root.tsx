import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function ColumnRoot({
  children,
  shadow = true,
  background = true,
  className,
}: {
  children: ReactNode;
  shadow?: boolean;
  background?: boolean;
  className?: string;
}) {
  return (
    <div className="h-full w-full p-2">
      <div
        className={cn(
          "relative flex h-full w-full flex-col rounded-xl",
          shadow ? "shadow-primary" : "",
          background ? "bg-white dark:bg-black" : "",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
