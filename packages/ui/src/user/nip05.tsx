import { VerifiedIcon } from "@lume/icons";
import { displayLongHandle, displayNpub } from "@lume/utils";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "./provider";
import { useRouteContext } from "@tanstack/react-router";
import * as Tooltip from "@radix-ui/react-tooltip";

export function UserNip05() {
  const user = useUserContext();

  const { ark } = useRouteContext({ strict: false });
  const { isLoading, data: verified } = useQuery({
    queryKey: ["nip05", user?.pubkey],
    queryFn: async () => {
      if (!user.profile?.nip05) return false;
      const verify = await ark.verify_nip05(user.pubkey, user.profile?.nip05);
      return verify;
    },
    enabled: !!user.profile,
  });

  if (!user.profile?.nip05?.length) return;

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger>
          {!isLoading && verified ? (
            <VerifiedIcon className="size-4 text-teal-500" />
          ) : null}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm font-medium text-neutral-50 will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-neutral-50 dark:text-neutral-950">
            {!user.profile?.nip05
              ? displayNpub(user.pubkey, 16)
              : user.profile?.nip05.length > 50
                ? displayLongHandle(user.profile?.nip05)
                : user.profile.nip05?.replace("_@", "")}
            <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
