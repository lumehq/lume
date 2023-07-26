import { useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

import { useImageUploader } from '@utils/hooks/useUploader';

export function AvatarUploader({ setPicture }: { setPicture: any }) {
  const upload = useImageUploader();
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async () => {
    const image = await upload(null);
    if (image.url) {
      // update parent state
      setPicture(image.url);

      // disable loader
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => uploadAvatar()}
      className="inline-flex h-full w-full items-center justify-center bg-zinc-900/40"
    >
      {loading ? (
        <LoaderIcon className="h-6 w-6 animate-spin text-zinc-100" />
      ) : (
        <PlusIcon className="h-6 w-6 text-zinc-100" />
      )}
    </button>
  );
}
