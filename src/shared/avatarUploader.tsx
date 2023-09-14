import { Dispatch, SetStateAction, useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function AvatarUploader({
  setPicture,
}: {
  setPicture: Dispatch<SetStateAction<string>>;
}) {
  const { upload } = useNostr();
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async () => {
    setLoading(true);
    const image = await upload(null);
    if (image.url) {
      setPicture(image.url);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={() => uploadAvatar()}
      className="inline-flex h-full w-full items-center justify-center rounded-lg bg-black/50 hover:bg-black/60"
    >
      {loading ? (
        <LoaderIcon className="h-6 w-6 animate-spin text-white" />
      ) : (
        <PlusIcon className="h-6 w-6 text-white" />
      )}
    </button>
  );
}
