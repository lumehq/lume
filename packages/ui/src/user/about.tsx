import { cn } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserAbout({ className }: { className?: string }) {
  const user = useUserContext();

  if (!user.profile) {
    return (
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "h-4 w-20 animate-pulse rounded bg-black/20 dark:bg-white/20",
            className,
          )}
        />
        <div
          className={cn(
            "h-4 w-full animate-pulse rounded bg-black/20 dark:bg-white/20",
            className,
          )}
        />
        <div
          className={cn(
            "h-4 w-24 animate-pulse rounded bg-black/20 dark:bg-white/20",
            className,
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn("content-break select-text", className)}>
      {user.profile.about?.trim() || "No bio"}
    </div>
  );
}
