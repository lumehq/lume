import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function ColumnRoot({
  children,
  className,
  background = true,
  shadow = true,
}: {
  children: ReactNode;
  className?: string;
  background?: boolean;
  shadow?: boolean;
}) {
  return (
    <div className="h-full w-full p-2">
      <div
        className={cn(
          "relative flex h-full w-full flex-col rounded-xl overflow-hidden",
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
