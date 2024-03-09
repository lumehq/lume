import { cn } from "@lume/utils";
import { ReactNode } from "react";

export function NoteRoot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-min w-full", className)} contentEditable={false}>
      {children}
    </div>
  );
}
