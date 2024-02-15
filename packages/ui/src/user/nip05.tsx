import { VerifiedIcon } from "@lume/icons";
import { cn, displayNpub } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "./provider";
import { useArk } from "@lume/ark";

export function UserNip05({ className }: { className?: string }) {
  const ark = useArk();
  const user = useUserContext();

  const { isLoading, data: verified } = useQuery({
    queryKey: ["nip05", user?.profile.nip05],
    queryFn: async () => {
      if (!user.profile?.nip05) return false;

      const verify = await ark.verify_nip05(user.pubkey, user.profile?.nip05);
      return verify;
    },
    enabled: !!user.profile,
  });

  if (!user.profile) {
    return (
      <div
        className={cn(
          "h-4 w-20 animate-pulse rounded bg-black/20 dark:bg-white/20",
          className,
        )}
      />
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <p className={cn("text-sm", className)}>
        {!user?.profile?.nip05
          ? displayNpub(user.pubkey, 16)
          : user?.profile?.nip05?.startsWith("_@")
            ? user?.profile?.nip05?.replace("_@", "")
            : user?.profile?.nip05}
      </p>
      {!isLoading && verified ? (
        <VerifiedIcon className="size-4 text-teal-500" />
      ) : null}
    </div>
  );
}
