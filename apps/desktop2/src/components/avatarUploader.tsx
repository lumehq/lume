import { useArk } from "@lume/ark";
import { LoaderIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function AvatarUploader({
  setPicture,
  children,
  className,
}: {
  setPicture: Dispatch<SetStateAction<string>>;
  children: ReactNode;
  className?: string;
}) {
  const ark = useArk();
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
      className={cn("", className)}
    >
      {loading ? <LoaderIcon className="size-4 animate-spin" /> : children}
    </button>
  );
}
