import { useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

import { useImageUploader } from '@utils/hooks/useUploader';

export function AvatarUploader({ setPicture }: { setPicture: any }) {
  const upload = useImageUploader();
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
