import { cn } from "@lume/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@lume/ui";
import { useUserContext } from "./provider";
import { NostrAccount } from "@lume/system";

export function UserFollowButton({
  simple = false,
  className,
}: {
  simple?: boolean;
  className?: string;
}) {
  const user = useUserContext();

  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    if (!followed) {
      const add = await NostrAccount.follow(user.pubkey, user.profile?.name);
      if (add) setFollowed(true);
    } else {
      const remove = await NostrAccount.unfollow(user.pubkey);
      if (remove) setFollowed(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function status() {
      setLoading(true);

      const contacts = await NostrAccount.getContactList();
      if (contacts?.includes(user.pubkey)) {
        setFollowed(true);
      }

      setLoading(false);
    }
    status();
  }, []);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => toggleFollow()}
      className={cn("w-max", className)}
    >
      {loading ? (
        <Spinner className="size-4" />
      ) : followed ? (
        !simple ? (
          t("user.unfollow")
        ) : null
      ) : (
        t("user.follow")
      )}
    </button>
  );
}
