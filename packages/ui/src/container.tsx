import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function Container({
  children,
  withDrag = false,
  className,
}: {
  children: ReactNode;
  withDrag?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-screen w-screen flex-col bg-gradient-to-tr from-neutral-200 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900",
        className,
      )}
    >
      {withDrag ? (
        <div data-tauri-drag-region className="h-11 w-full shrink-0" />
      ) : null}
      {children}
    </div>
  );
}
