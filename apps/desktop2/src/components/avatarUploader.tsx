import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function AvatarUploader({
  setPicture,
}: {
  setPicture: Dispatch<SetStateAction<string>>;
}) {
  const ark = useArk();

  const [t] = useTranslation();
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async () => {
    // start loading
    setLoading(true);
    try {
      const image = await ark.upload();
      setPicture(image);
    } catch (e) {
      toast.error(String(e));
    }

    // stop loading
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={() => uploadAvatar()}
      className="inline-flex w-32 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 px-2 py-1.5 text-sm font-medium text-blue-500 hover:border-blue-300 hover:bg-blue-200 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-500 dark:hover:border-blue-800 dark:hover:bg-blue-800"
    >
      {loading ? (
        <button type="button" className="size-4" disabled>
          <LoaderIcon className="size-4 animate-spin" />
        </button>
      ) : (
        t("user.avatarButton")
      )}
    </button>
  );
}
