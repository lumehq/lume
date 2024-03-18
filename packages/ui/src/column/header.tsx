import { cn } from "@lume/utils";

export function ColumnHeader({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-full shrink-0 items-center justify-center gap-2 border-b border-neutral-100 dark:border-neutral-900",
        className,
      )}
    >
      <div className="inline-flex items-center gap-1.5">
        <div className="text-[13px] font-medium">{name}</div>
      </div>
    </div>
  );
}
