import { cn } from "@lume/utils";
import * as Avatar from "@radix-ui/react-avatar";
import { minidenticon } from "minidenticons";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { useUserContext } from "./provider";

export function UserAvatar({ className }: { className?: string }) {
  const user = useUserContext();

  const fallbackAvatar = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        minidenticon(user.pubkey || nanoid(), 90, 50),
      )}`,
    [user],
  );

  return (
    <Avatar.Root className="shrink-0">
      <Avatar.Image
        src={user.profile?.picture}
        alt={user.pubkey}
        loading="eager"
        decoding="async"
        className={cn("ring-1 ring-black/5 dark:ring-white/5", className)}
      />
      <Avatar.Fallback delayMs={120}>
        <img
          src={fallbackAvatar}
          alt={user.pubkey}
          className={cn("bg-black dark:bg-white", className)}
        />
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
