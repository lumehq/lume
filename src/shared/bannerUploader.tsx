import { useState } from 'react';

import { LoaderIcon, PlusIcon } from '@shared/icons';

import { useImageUploader } from '@utils/hooks/useUploader';

export function BannerUploader({ setBanner }: { setBanner: any }) {
  const upload = useImageUploader();
  const [loading, setLoading] = useState(false);

  const uploadBanner = async () => {
    const image = await upload(null);
    if (image.url) {
      // update parent state
      setBanner(image);

      // disable loader
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => uploadBanner()}
      className="inline-flex h-full w-full items-center justify-center bg-zinc-900/40"
    >
      {loading ? (
        <LoaderIcon className="h-8 w-8 animate-spin text-zinc-100" />
      ) : (
        <PlusIcon className="h-8 w-8 text-zinc-100" />
      )}
    </button>
  );
}
