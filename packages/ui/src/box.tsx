import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function Box({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="h-full w-full flex-1 px-2 pb-2">
        <div
          className={cn(
            "h-full w-full overflow-y-auto rounded-xl bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] dark:bg-black dark:shadow-none dark:ring-1 dark:ring-white/5",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
