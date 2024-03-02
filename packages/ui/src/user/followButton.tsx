import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserContext } from "./provider";

export function UserFollowButton({ className }: { className?: string }) {
  const ark = useArk();
  const user = useUserContext();

  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    if (!followed) {
      const add = await ark.follow(user.pubkey);
      if (add) setFollowed(true);
    } else {
      const remove = await ark.unfollow(user.pubkey);
      if (remove) setFollowed(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function status() {
      setLoading(true);

      const contacts = await ark.get_contact_list();
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
      onClick={toggleFollow}
      className={cn("w-max", className)}
    >
      {loading ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : followed ? (
        t("user.unfollow")
      ) : (
        t("user.follow")
      )}
    </button>
  );
}
