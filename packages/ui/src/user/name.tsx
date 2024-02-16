import { cn } from "@lume/utils";
import { useUserContext } from "./provider";

export function UserName({ className }: { className?: string }) {
  const user = useUserContext();

  if (!user.profile) {
    return (
      <div
        className={cn(
          "mb-1 h-3 w-20 animate-pulse self-center rounded bg-black/20 dark:bg-white/20",
          className,
        )}
      />
    );
  }

  return (
    <div className={cn("max-w-[12rem] truncate", className)}>
      {user.profile.display_name || user.profile.name || "Anon"}
    </div>
  );
}
